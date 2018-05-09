import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowLoadService } from '../../services/flowload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessService } from '../../services/process.service';
import { newBpmnDiagram } from '../../new-bpmn-diagram';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY_XML } from '../../../global';
import { PropertiesService } from '../../services/properties.service';
import { IOption } from 'ng-select';
import { UserService } from '../../../auth/user.service';
import { ConfirmationService } from '../../../auth/confirmation.service';
import { Observable } from 'rxjs/Observable';

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
   * message                    :   message that will be displayed in an empty properties panel
   * processName                :   name of loaded process
   * processCode                :   code of loaded process
   * editingName                :   whether the title should be replaced by an input field for editing (true|false)
   * overlay                    :   whether an overlay is shown to temporarily block interaction (e.g. while loading) (true|false)
   * overlayText                :   text that should be displayed in the overlay
   * selectedProperties         :   an array that holds the properties of the selected item
   * selectedPropertiesId       :   a string that holds the id of the selected item
   * editableTypes              :   an array of types that should be editable within the Modeler.
   * properties                 :   an object that contains all process properties
   * forms                      :   an array of all forms created with the form builder
   * users                      :   an array that contains all users
   * helpers                    :   an object of help messages
   * callers                    :   an array that holds all callers that are being used by the process
   * sequence                   :   an array that holds the process sequence
   * processItems               :   an array that holds all process items
   * processItemsNames          :   an array that holds all the names of all process items
   * selectableDecisions        :   an array that gets filled with decisions based on predecessor of selected gateway
   * saved                      :   boolean that indicates if the process has been saved
   * propertiespanel CSS class  :   the CSS class for the propertiespanel
   * */

  private param: any;
  private subs = [];
  private modeler: any;
  protected message = 'No item selected';
  protected processName = '';
  protected processCode = '';
  protected editingName = false;
  protected overlay = true;
  protected overlayText = 'Loading process...';
  protected selectedProperties = [];
  protected selectedPropertiesId = '';
  protected editableTypes = ['task', 'exclusivegateway', 'startevent', 'endevent'];
  protected properties = {};
  protected forms = [];
  protected users: Array<IOption> = [{value: 'initiator', label: 'Process initiator'}];
  protected helpers = {};
  protected callers = [];
  protected sequence = [];
  protected processItems = [];
  protected processItemsNames = {};
  protected selectableDecisions = [];
  protected saved = false;
  protected propertiesCssClass = '';

  /**
   * Form properties bindings
   *
   * */
  protected decision = '';
  protected assignees: Array<any> = [];
  protected decisions: Array<any> = [];

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
      private confirmationService: ConfirmationService
  ) { }

  // canDeactivate(): Observable<boolean> | boolean {
  //     if (this.saved === false) {
  //         return this.confirmationService.confirm();
  //     }
  //     return true;
  // }

  @ViewChild('nameContainer') nameContainer;

  /**
   * Listen to click events
   *
   * */
  checkClick(targetElement) {
      if (targetElement.classList.contains('canvas')) {
          this.message = 'No item selected';
          this.propertiesCssClass = '';
          this.dismissProperties();
      }
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
      // Toggle name edit textfield
      if (!this.nameContainer.nativeElement.contains(targetElement)) {
        this.editingName = false;
        $('.edit-name').trigger('click');
      }

      // Show selected item properties
      if (targetElement.classList.contains('djs-hit')) {
          const typeUnformatted = targetElement.parentElement.getAttribute('data-element-id');
          const type = typeUnformatted.substring(0, typeUnformatted.indexOf('_')).toLowerCase();
          if (this.editableTypes.indexOf(type) !== -1 && !typeUnformatted.includes('_label')) {
              const id = targetElement.parentElement.getAttribute('data-element-id');
              this.selectedPropertiesId = id;
              this.message = 'No item selected';
              this.propertiesCssClass = '';
              this.getSequenceFlow();
              this.initProperties(id, type);
          }
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
      this.helpers = this.propertiesService.helpers();
      this.subs.push(
          this.route.params.subscribe(res => this.param = res['param']),
          this.processService.processName.subscribe(processName => this.processName = processName),
          this.processService.processCode.subscribe(processCode => this.processCode = processCode),
          this.propertiesService.getForms().subscribe(forms => this.forms = forms),
          this.auth.getUsers(false).subscribe(users => {
            for (const user of users) {
              this.users.push({label: user['name'], value: user['id']});
            }
          })
      );
      this.auth.getUsers();

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
   * Decide whether properties for the selected element already exist
   * or they should be build for the selected element.
   *
   * @param     id - id of selected item
   * @param     type - type of selected item
   * */
  private initProperties(id: string, type: string) {
    if (type === 'exclusivegateway' && !this.propertiesService.getPredecessor(id, this.sequence)) {
      // Selected exclusive gateway has no predecessor, so properties can't be build.
      this.message = 'An exclusive gateway must have a predecessor.';
    } else if (type === 'exclusivegateway' && this.propertiesService.getDescendants(id, this.sequence).length > 0) {
      const descendants = this.propertiesService.getDescendants(id, this.sequence);
      this.checkIfDescendantsExist(id);
      for (const descendant of descendants) {
          let hasDescendant = false;
          for (const output of this.properties[id]['output']) {
              if (output['id'] === descendant) {
                  hasDescendant = true;
              }
          }
          if (!hasDescendant) {
              this.properties[id]['output'].push({id: descendant, value: ''});
          }
      }
      this.linkItemIdsToNames();
      this.showProperties(id, type);
      this.propertiesCssClass = 'show';
    } else {
      this.linkItemIdsToNames();
      this.showProperties(id, type);
      this.propertiesCssClass = 'show';
    }
    if (this.properties[id] && type === 'exclusivegateway') {
        // If properties of selected item exist and type is 'exclusivegateway',
        // get decisions from predecessor.
        const source = this.properties[id]['predecessor'];
        const decisions = this.properties[source]['decisions'];
        this.selectableDecisions = decisions;
    }
  }

  /**
   * Show properties in the properties panel
   *
   * @param   id - id of selected item
   * @param   type - id of selected item
   * */
  private showProperties(id: string, type: string) {
      if (!this.properties[id]) {
          // If properties don't exist in array, build them
          this.properties[id] = this.propertiesService.generatePropertiesByType(id, type, this.sequence);
          this.setSelectedProperties(this.properties[id]);
      } else {
          // Properties already exist, just show them
          const properties = this.properties[id];
          this.selectedProperties = [];
          Object.keys(properties).forEach((key) => {
              this.selectedProperties.push([key, properties[key]]);
              if (key === 'assignees') {
                  this.assignees = properties[key];
              }
              if (key === 'decisions') {
                  this.decisions = properties[key];
              }
          });
      }
      this.cleanProperties();
  }

  /**
   * Link all process items ids to their name
   *
   * */
  private linkItemIdsToNames() {
      this.modeler.saveXML({ format: true }, (err, xml) => {
          if (err) {
              console.log(err);
          } else {
              parseString(xml, (error, result) => {
                  if (error) {
                      console.log(error);
                  } else {
                      this.processItemsNames = [];
                      const items = result['bpmn:definitions']['bpmn:process'][0];
                      for (const item in items) {
                          if (item !== '$' && item !== 'bpmn:sequenceFlow') {
                              for (const event of items[item]) {
                                  this.processItemsNames[event['$']['id']] = event['$']['name'];
                              }
                          }
                      }
                  }
              });
          }
      });
  }

  /**
   * Set selected properties
   *
   * @param    properties - an array of all properties
   * */
  private setSelectedProperties(properties: any) {
    const editableProperties = [];
    for (const property in properties) {
      if (property) {
          editableProperties.push([property, properties[property]]);
      }
    }
    this.selectedProperties = editableProperties;
  }

  /**
   * Save properties that are currently open in the properties panel
   *
   * @param    event - click event
   * */
  protected saveProperties(event) {
    event.preventDefault();
    const properties = this.properties[this.selectedPropertiesId];
    const formData = $('#properties-form').serializeArray();
    for (const data of formData) {
        if (data['name'].includes('Task_') === false && data['name'].includes('decision') === false) {
            properties[data['name']] = data['value'];
        }
    }
    if (properties['caller'] && this.callers.indexOf(properties['caller']) === -1) {
        this.callers.push(properties['caller']);
    }
    if (properties['assignees']) {
        properties['assignees'] = this.assignees;
    }
    if (properties['decisions']) {
       properties['decisions'] = this.decisions;
    }
    if (properties['output']) {
        for (const decision of properties['output']) {
            decision['value'] = $('select[name="' + decision['id'] + '"').val();
        }
    }
    this.properties[this.selectedPropertiesId] = properties;
    this.dismissProperties();
  }

  /**
   * Close properties panel
   *
   * */
  protected dismissProperties() {
      this.selectedProperties = [];
      this.assignees = [];
      this.decisions = [];
      this.selectedPropertiesId = '';
      this.propertiesCssClass = '';
  }

  /**
   * Change decisions based on keyboard input
   *
   * @param    event - keyboard event
   * */
  protected alterDecisions(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          if (this.decisions.indexOf(this.decision) === -1) {
              this.decisions.push(this.decision);
              this.decision = '';
              $('input[name="decision"]').width('2px');
          }
      }
      if (event.key === 'Backspace') {
          if (this.decision === '' && this.decisions.length > 0) {
              this.decisions.splice(-1, 1);
              $('input[name="decision"]').width('2px');
          }
      }
      this.focusInput();
  }

  /**
   * Remove selected decision
   *
   * @param    decision - selected decision
   * */
  protected removeDecision(decision) {
      this.decisions.splice(this.decisions.indexOf(decision), 1);
  }

  protected focusInput() {
      $('input[name="decision"]').focus();
  }

  /**
   * Get the sequenceflow of the xml workflow.
   * The sequence will immediately be pushed into {this.sequence} var.
   *
   * */
  protected getSequenceFlow() {
    this.modeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
            console.log(err);
        } else {
            parseString(xml, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    this.sequence = [];
                    const sequence = result['bpmn:definitions']['bpmn:process'][0]['bpmn:sequenceFlow'];
                    if (sequence) {
                        for (const item of sequence) {
                            this.sequence.push(item['$']);
                        }
                    }
                }
            });
        }
    });
  }

  /**
   * Get all process items
   *
   * */
  protected getProcessItems() {
      this.modeler.saveXML({ format: true }, (err, xml) => {
          if (err) {
              console.log(err);
          } else {
              parseString(xml, (error, result) => {
                  if (error) {
                      console.log(error);
                  } else {
                      this.processItems = [];
                      if (result['bpmn:definitions']['bpmn:process'][0].hasOwnProperty('bpmn:sequenceFlow')) {
                          const items = result['bpmn:definitions']['bpmn:process'][0]['bpmn:sequenceFlow'];
                          for (const item of items) {
                              this.processItems.push(item['$']['targetRef']);
                          }
                      }
                      if (result['bpmn:definitions']['bpmn:process'][0].hasOwnProperty('bpmn:startEvent')) {
                          const startevents = result['bpmn:definitions']['bpmn:process'][0]['bpmn:startEvent'];
                          for (const startevent of startevents) {
                              this.processItems.push(startevent['$']['id']);
                          }
                      }
                  }
              });
          }
      });
  }

  /**
   * Remove properties from non-existing object
   *
   * */
  private cleanProperties() {
    this.getProcessItems();
    for (const property in this.properties) {
      if (this.processItems.indexOf(property) === -1) {
        delete this.properties[property];
      }
    }
  }

  /**
   * Check if descendants of exclusive gateway outputs still exist
   * If a descendant doesn't exist anymore, remove it
   *
   * @param     id - selected item id
   * */
  private checkIfDescendantsExist(id) {
    const descendants = [];
    this.getSequenceFlow();
    this.sequence.forEach((item) => {
       if (item['sourceRef'] === id) {
           descendants.push(item['targetRef']);
       }
    });

    const outputs = this.properties[id]['output'];
      outputs.forEach((output, i) => {
      if (descendants.indexOf(output['id']) === -1) {
          this.properties[id]['output'].splice(i, 1);
      }
    });
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
      this.processName = process['name'];
      this.processCode = process['code'];
      this.properties = JSON.parse(process['properties']);
      this.overlayText = 'Loading process...';
      this.modeler.importXML(process['process_xml'], err => {
        if (!err) {
          this.resetZoom();
          this.overlay = false;
          this.getSequenceFlow();
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
        this.resetZoom();
        this.overlay = false;
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
      additionalModules: []
    });
  }

  /**
   * Save the process
   *
   * */
  saveProcess() {
    this.cleanProperties();
    this.overlayText = 'Saving process...';
    this.overlay = true;
    let process_xml = '';
    this.modeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
            console.log(err);
        } else {
            this.saved = true;
            process_xml = xml;
        }
    });

    if (this.param === 'new') {
      this.processService.newProcess(this.processName, this.processCode, process_xml, this.properties, this.callers).subscribe((res) => {
          console.log(res);
          if (res['status'] === 200) {
            window.history.pushState('', 'Chassis Automation', '/processes/' + res['id']);
            this.param = res['id'];
            this.overlay = false;
          } else {
            this.overlayText = res['message'];
          }
      });
    } else {
      this.processService.saveProcess(this.param, this.processName, this.processCode, process_xml, this.properties, this.callers).subscribe((res) => {
          this.overlay = false;
      });
    }
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
   * When the component gets destroyed, unsubscribe all of the component subscriptions
   *
   * */
  ngOnDestroy() {
    this.flowLoader.process.next(EMPTY_XML);
    this.subs.forEach(sub => sub.unsubscribe);
  }
}
