import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProcessService } from '../../services/process.service';
import { DeployService } from '../../services/deploy.service';
import { DeleteService } from '../../services/delete.service';
import { FlowLoadService } from '../../services/flowload.service';

declare var require;
const Viewer = require('bpmn-js/lib/Viewer');

@Component({
  selector: 'app-processes-overview',
  templateUrl: './processes-overview.component.html',
  styleUrls: ['./processes-overview.component.scss']
})
export class ProcessesOverviewComponent implements OnInit, OnDestroy {

  /**
    * processes   :   received processes
    * process     :   empty array for new process
    * deployment  :   an object which holds all process deployment statusses
    * subs        :   component subscriptions
    * */

  protected processes = [];
  protected process = [];
  protected viewer: any;
  protected deployment: any;
  private subs = [];

  /**
   * Inject required services
   *
   * */
  constructor(
      private flowLoader: FlowLoadService,
      private processService: ProcessService,
      private deployService: DeployService,
      private deleteService: DeleteService
  ) { }

  /**
   * On component initialization, get all processes and build deployment array
   *
   * */
  ngOnInit() {
    this.viewer = new Viewer({container: '#canvas'});
    const deploymentObject = {};
    this.subs.push(
      this.processService.processes.subscribe((processes) => {
          this.processes = processes;
          /** Create an array with all deployment statusses */
          for (const process of processes) {
              deploymentObject[process['id']] = process['deploy'];
          }
      })
    );
    this.processService.getProcesses();
    this.deployService.deployment.next(deploymentObject);
    this.subs.push(this.deployService.deployment.subscribe(deployment => this.deployment = deployment));
  }

  /**
   * Pass data to modal for deployment confirmation
   *
   * @param state - current deployment state
   * @param id - process id
   * @param name - process name
   * */
  deployModal(state, id, name) {
    if (state === 'false') {
      this.deployService.deployModelContent.next({
        'id': id,
        'name': name,
        'type': 'deploy',
        'title': 'Deploy',
        'text': 'Are you sure you want to deploy \'' + name + '\'?'
      });
    } else {
      this.deployService.deployModelContent.next({
        'id': id,
        'name': name,
        'type': 'undeploy',
        'title': 'Undeploy',
        'text': 'Are you sure you want to undeploy \'' + name + '\'?'
      });
    }
  }

  /**
   * Delete a process
   *
   * @param id - process id
   * @param name - process name
   * */
  deleteProcess(id, name) {
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
    this.flowLoader.load(id);
    this.flowLoader.process.subscribe(process => {
      this.viewer.importXML(process['process_xml'], function(err) {
        if (err) {
          console.log(err);
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
