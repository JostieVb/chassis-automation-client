import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowLoadService } from '../../services/flowload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessService } from '../../services/process.service';
import { newBpmnDiagram } from '../../new-bpmn-diagram';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY_XML } from '../../../global';
import { PropertiesService } from '../../services/properties.service';
import { UserService } from '../../../auth/user.service';
import { AlertService } from '../../../components/services/alert.service';
import { Alert } from '../../../components/alert/alert';
import { SelectedProperty } from '../../models/selected-property';
import { REGISTERED_PROPERTIES } from '../../models/properties/registered-properties';
import { FormsService } from '../../../forms/services/forms.service';

declare var require: any;
const Modeler = require('bpmn-js/lib/Modeler'),
      $ = require('jQuery'),
      parseString = require('xml2js').parseString;

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css'],
  providers: [NgbModalModule]
})

export class ModelerComponent implements OnInit, OnDestroy {

    /**
   * param                      :   id:number ? 'new':string
   * subs                       :   component subscriptions
   * modeler                    :   instance of the bpmn-js modeler
   * eventBus                   :   the eventbus that handles all interaction with the modeler
   * message                    :   message that will be displayed in an empty properties panel
   * processName                :   name of loaded process
   * processCode                :   code of loaded process
   * editingName                :   whether the title should be replaced by an input field for editing (true|false)
   * overlay                    :   whether an overlay is shown to temporarily block interaction (e.g. while loading) (true|false)
   * overlayText                :   text that should be displayed in the overlay
   * properties                 :   an object that contains all process properties
   * helpers                    :   an object of help messages
   * caller                     :   the process' caller
   * saved                      :   boolean that indicates if the process has been saved
   * */

  private param: any;
  private subs = [];
  private modeler: any;
  private eventBus: any;
  protected message = 'No item selected';
  protected processName = '';
  protected processCode = '';
  protected editingName = false;
  protected overlay = true;
  protected overlayText = 'Loading process...';
  protected properties = {};
  protected caller = '';
  protected saved = false;


  /**
   * Inject required services
   *
   * */
  constructor(
    private http: HttpClient,
    private flowLoader: FlowLoadService,
    private processService: ProcessService,
    private route: ActivatedRoute,
    private router: Router,
    private propertiesService: PropertiesService,
    private auth: UserService,
    private alert: AlertService,
    private formsService: FormsService
  ) { }

  @ViewChild('nameContainer') nameContainer;

  checkClick(targetElement) {
    if (targetElement.classList.contains('canvas')) {
      this.propertiesService.selectedPropertyIdAndType.next(new SelectedProperty('', ''));
    }
  }

  /**
   * Listen to click events
   *
   * */
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
    // Toggle name edit textfield
    if (!this.nameContainer.nativeElement.contains(targetElement)) {
      this.editingName = false;
      $('.edit-name').trigger('click');
    }
  }

  /**
   * On component initialization, get process name and code.
   * Decide whether an existing process should be loaded,
   * or a new process instance should be created.
   *
   * */
  ngOnInit() {
    this.overlay = true;
    this.subs.push(
      this.route.params.subscribe(res => this.param = res['param']),
      this.processService.processName.subscribe(processName => this.processName = processName),
      this.processService.processCode.subscribe(processCode => this.processCode = processCode),
      this.propertiesService.properties.subscribe(properties => this.properties = properties),
      this.propertiesService.getNativeProperty.subscribe(property => {
          const value = this.getNativeProperty(property['id'], property['property']);
          this.propertiesService.nativeProperty.next(value);
      }),
      this.propertiesService.getNativeType.subscribe(id => {
        if (id !== '') {
          const type = this.getNativeType(id);
          this.propertiesService.nativeType.next(type);
        }
      }),
      this.propertiesService.updateNativeProperty.subscribe(update => {
        if (update.id) {
          this.updateNativeProperty(update.id, update.property, update.value);
        }
      }),
      this.propertiesService.getSequence.subscribe(bool => {
        if (bool) { this.getSequence(); }
      }),
       this.propertiesService.getProcessItems.subscribe(bool => {
        if (bool) { this.getProcessItems(); }
      })
    );

    if (this.param !== 'new') {
      this.load(this.param);
    } else {
      if (this.processName === '') {
        this.router.navigateByUrl('/processes');
      }
      this.new();
    }
  }

  /**
   * Load existing diagram
   *
   * @param     id - id of diagram
   * */
  load(id) {
    this.modeler = this.instantiateModeler();
    this.flowLoader.load(id).subscribe((res) => {
      const process = res[0];
      this.caller = process['caller'];
      this.processName = process['name'];
      this.processCode = process['code'];
      const properties = JSON.parse(process['properties']);
      this.propertiesService.properties.next(properties);
      this.overlayText = 'Loading process...';
      this.modeler.importXML(process['process_xml'], err => {
        if (!err) {
          this.resetZoom();
          this.overlay = false;
          this.formsService.getFormFields(properties['StartEvent_1']['caller']);
          this.setModelerEventHooks();
        }
      });
    });
  }

  /**
   * Load new diagram
   *
   * */
  new() {
    this.modeler = this.instantiateModeler();
    const file = newBpmnDiagram;
    this.overlayText = 'Loading process...';
    this.modeler.importXML(file, err => {
      if (err) {
        console.log(err);
      } else {
        this.caller = this.processService.processCaller.getValue();
        this.properties['StartEvent_1'] = {
            id: 'StartEvent_1',
            type: 'startevent',
            caller: this.caller
        };
        this.resetZoom();
        this.overlay = false;
        this.setModelerEventHooks();
      }
    });
  }

  /**
   * Set the event hooks to the modeler to enable user interaction
   *
   * */
  setModelerEventHooks() {
    const eventBus = this.modeler.get('eventBus');
    eventBus.on('element.dblclick', 1500, (event) => {
        const type = event.element.type.replace('bpmn:', '').toLowerCase();
        const id = event.element.id;
        if (REGISTERED_PROPERTIES.indexOf(type) > -1) {
            this.propertiesService.showDecisions.next(false);
            this.propertiesService.decisions.next([]);
            const name = this.getNativeProperty(event.element.id, 'name');
            this.propertiesService.updateProperties(event.element.id, type, 'name', name);
            if (type === 'sequenceflow') {
              const sourceRef = event.element.businessObject.sourceRef['$type'].replace('bpmn:', '').toLowerCase();
              if (sourceRef === 'exclusivegateway') {
                // Get decisions of the previous element
                this.propertiesService.selectedPropertyIdAndType.next(new SelectedProperty(id, type));
                const predecessors = event.element.businessObject.sourceRef.incoming;
                const allDecisions = [];
                predecessors.forEach(predecessor => {
                  if (this.properties[predecessor.sourceRef.id] !== undefined && this.properties[predecessor.sourceRef.id]['decisions'] !== undefined) {
                    const decisions = this.properties[predecessor.sourceRef.id]['decisions'];
                    decisions.forEach(decision => {
                      allDecisions.push(decision);
                    });
                  }
                });
                this.propertiesService.decisions.next(allDecisions);
                event.stopPropagation();
              }
            } else if (type === 'task' || type === 'sendtask' || type === 'receivetask' || type === 'usertask') {
              const predecessors = event.element.businessObject.outgoing;
              if (predecessors !== undefined) {
                predecessors.forEach(predecessor => {
                    if (predecessor.targetRef['$type'].replace('bpmn:', '').toLowerCase() === 'exclusivegateway') {
                        // Show the decisions if predecessor is an exclusive gateway
                        this.propertiesService.showDecisions.next(true);
                    }
                });
              }
              this.propertiesService.selectedPropertyIdAndType.next(new SelectedProperty(id, type));
              event.stopPropagation();
            } else {
              this.propertiesService.selectedPropertyIdAndType.next(new SelectedProperty(id, type));
              event.stopPropagation();
            }
        }
    });
  }

  /**
   * Create a new instance of the BPMN-js Modeler
   *
   * */
  instantiateModeler() {
    return new Modeler({
      container: '.canvas',
      keyboard: { bindTo: document },
      additionalModules: []
    });
  }

  /**
   * Save the process
   *
   * */
  saveProcess() {
    this.overlayText = 'Saving process...';
    this.overlay = true;
    let process_xml = '';
    this.modeler.saveXML({format: true}, (err, xml) => {
      if (err) {
        console.log(err);
      } else {
        this.saved = true;
        process_xml = xml;
      }
    });
    if (this.param === 'new') {
        this.processService.newProcess(this.processName, this.processCode, process_xml, this.properties, this.caller).subscribe((res) => {
            if (res['status'] === 200) {
                window.history.pushState('', 'Chassis Automation', '/processes/' + res['id']);
                this.param = res['id'];
                this.alert.alert.next(new Alert('The process was successfully saved.', 'success', '', true, false));
            } else {
                this.alert.alert.next(new Alert(
                    'The process could not be saved: \'' + res['message'] + '\'',
                    'danger',
                    '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>',
                    true,
                    false));
            }
            this.overlay = false;
        });
    } else {
        this.processService.saveProcess(this.param, this.processName, this.processCode, process_xml, this.properties, this.caller).subscribe((res) => {
            this.alert.alert.next(new Alert(
                'The process was successfully saved.',
                'success',
                '',
                true,
                false));
            this.overlay = false;
        });
    }
  }

  /**
   * Get the sequence of the xml workflow.
   * The sequence will immediately be pushed into {this.sequence} var.
   *
   * */
  protected getSequence() {
    if (this.modeler) {
        this.modeler.saveXML({format: true}, (err, xml) => {
            if (err) {
                console.log(err);
            } else {
                parseString(xml, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        const sequence = [];
                        const seq = result['bpmn:definitions']['bpmn:process'][0]['bpmn:sequenceFlow'];
                        if (seq) {
                            for (const item of seq) {
                                sequence.push(item['$']);
                            }
                            this.propertiesService.sequence.next(sequence);
                        }
                    }
                });
            }
        });
    }
  }

  /**
   * Get all items of the process
   *
   * */
  protected getProcessItems() {
    this.modeler.invoke((elementRegistry) => {
      const elements = elementRegistry['_elements'];
      this.propertiesService.processItems.next(Object.keys(elements));
    });
    this.propertiesService.getProcessItems.next(false);
  }

  /**
   * Update a native property of the modeler.
   * Native properties are properties that are stored directly in the XML
   * of the process.
   *
   * @param     id - id of the edited element
   * @param     property - name of the property that should edited
   * @param     value - new value
   * */
  updateNativeProperty(id: string, property: string, value: string) {
    this.modeler.invoke((elementRegistry, modeling) => {
      const element = elementRegistry.get(id);
      if (property === 'type') {
        const name = element.businessObject.name;
        const replace = this.modeler.get('replace');
        const type = 'bpmn:' + value;
        const data = {type: type, name: name};
        replace.replaceElement(element, data);
        this.updateNativeProperty(id, 'name', name);
      } else {
        const data = [];
        data[property] = value;
        modeling.updateProperties(element, data);
      }
    });
    this.propertiesService.updateNativeProperty.next({id: null, property: null, value: null});
  }

  /**
   * Get a native property's value
   *
   * @param     id - id of the element that holds the property
   * @param     property - name of the property
   * @return    string - the value of the desired property
   * */
  getNativeProperty(id: string, property: string) {
    let output = null;
    if (id && property) {
      this.modeler.invoke((elementRegistry) => {
        const element = elementRegistry.get(id).businessObject;
        output = element[property];
      });
    }
    return output;
  }

  /**
   * Get the native type from the XML
   *
   * @param id - the id of the selected element
   * */
  getNativeType(id: string) {
    let type = null;
    this.modeler.invoke((elementRegistry) => {
      type = elementRegistry.get(id).businessObject['$type'].replace('bpmn:', '');
    });
    return type;
  }

  /**
   * Export the process to XML
   *
   * */
  exportXml() {
    this.modeler.saveXML({ format: true }, (err, xml) => {
      if (!err) {
        console.log(xml);
      }
    });
  }

  /**
   * Export the process to SVG
   *
   * */
  exportSvg() {
    console.log('svg export');
  }

  /**
   * Toggle the edit name field
   *
   * */
  editName() {
    if (!this.editingName) {
      this.editingName = true;
      $('.edit-name').focus();
    }
  }

  /**
   * Reset zoom and position diagram relative to viewport
   *
   * */
  resetZoom() {
    this.modeler.get('canvas').zoom('fit-viewport');
  }

  /**
   * Show the keyboard shortcuts
   *
   * */
  showKeyboardShortcuts() {
    this.processService.showKeyboardShortcuts.next(true);
  }

  /**
   * When the component gets destroyed, unsubscribe all of the component subscriptions
   *
   * */
  ngOnDestroy() {
    this.flowLoader.process.next(EMPTY_XML);
    this.propertiesService.properties.next({});
    this.propertiesService.selectedPropertyIdAndType.next(new SelectedProperty('', ''));
    this.propertiesService.keys.next([]);
    this.propertiesService.getNativeType.next('');
    this.subs.forEach(sub => sub.unsubscribe);
  }
}
