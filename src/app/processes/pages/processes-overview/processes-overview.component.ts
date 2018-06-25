import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProcessService } from '../../services/process.service';
import { DeployService } from '../../services/deploy.service';
import { DeleteService } from '../../services/delete.service';
import { FlowLoadService } from '../../services/flowload.service';
import { EMPTY_XML } from '../../../global';
import { AlertService } from '../../../components/services/alert.service';
import { Alert } from '../../../components/alert/alert';
import { FormsService } from '../../../forms/services/forms.service';

declare var require;
const Viewer = require('bpmn-js/lib/Viewer');

@Component({
  selector: 'app-processes-overview',
  templateUrl: './processes-overview.component.html',
  styleUrls: ['./processes-overview.component.scss']
})
export class ProcessesOverviewComponent implements OnInit, OnDestroy {

  /**
    * loading     :   indicates whether the processes are loading
    * processes   :   associative array of all processes
    * keys        :   ids of all processes
    * process     :   empty array for new process
    * deploying   :   holds the id of the process that is currently deploying/undeploying
    * subs        :   component subscriptions
    * */

  protected loading = true;
  protected processes = [];
  protected keys = [];
  protected process = [];
  protected viewer: any;
  protected deploying = 0;
  private subs = [];

  /**
   * Inject required services
   *
   * */
  constructor(
      private flowLoader: FlowLoadService,
      private processService: ProcessService,
      private deployService: DeployService,
      private deleteService: DeleteService,
      private alert: AlertService,
      private formsService: FormsService
  ) { }

  /**
   * On component initialization, get all processes and build deployment array
   *
   * */
  ngOnInit() {
    this.formsService.getForms();
    this.viewer = new Viewer({container: '#canvas'});
    this.subs.push(
      this.processService.processes.subscribe(processes => {
        this.processes = processes;
        this.keys = Object.keys(processes);
      }),
      this.processService.loadingProcesses.subscribe(value => this.loading = value),
      this.deployService.deploying.subscribe(deploying => this.deploying = deploying)
    );
    this.processService.getProcesses();
  }

  /**
   * Pass data to modal for deployment confirmation
   *
   * @param event - the click event on the toggle button
   * @param state - current deployment state
   * @param id - process id
   * @param name - process name
   * @param link - the linked caller (form) of the process
   * */
  deployModal(event: any, state: string, id: number, name: string) {
      let action = 'deploy';
      if (state === 'true') {
        action = 'undeploy';
      }

      this.deployService.deployModelContent.next({
        'id': id,
        'name': name,
        'type': action,
        'title': action,
        'text': 'Are you sure you want to ' + action + ' \'' + name + '\'?'
      });
  }

  /**
   * Delete a process
   *
   * @param id - process id
   * @param name - process name
   * */
  deleteProcess(id: number, name: string) {
    this.deleteService.content.next({
        'id': id,
        'name': name
    });
  }

  /**
   * Load process diagram preview based on id
   *
   * @param id - process id
   * */
  loadPreview(id) {
    this.viewer.importXML(EMPTY_XML);
    this.flowLoader.previewLoaded.next(false);
    this.flowLoader.loadingPreview.next(true);
    this.flowLoader.load(id).subscribe(process => {
      this.viewer.importXML(process[0]['process_xml'], err => {
        if (err) {
          console.log(err);
        } else {
          this.flowLoader.previewLoaded.next(true);
          this.flowLoader.loadingPreview.next(false);
          this.viewer.get('canvas').zoom('fit-viewport');
        }
      });
    });
  }

  /**
   * When the component gets destroyed, unsubscribe to all of the component's subscriptions
   *
   * */
  ngOnDestroy() {
    this.processService.processes.next([]);
      this.subs.forEach(function(sub) {
          sub.unsubscribe();
      });
  }
}
