import {Component, OnDestroy, OnInit} from '@angular/core';
import { DeployService } from '../../services/deploy.service';
import { Alert } from '../../../components/alert/alert';
import { AlertService } from '../../../components/services/alert.service';
import { ProcessService } from '../../services/process.service';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.scss']
})
export class DeployComponent implements OnInit, OnDestroy {

  /**
   * content            :       the content that should be displayed in the modal
   * subs               :       modal subscriptions
   * */
  protected content = {};
  private subs = [];

  constructor(
    private deployService: DeployService,
    private alert: AlertService,
    private processService: ProcessService
  ) { }

  /**
   * On initialization, subscribe to the data from the deployService
   *
   * */
  ngOnInit() {
    this.subs.push(
        this.deployService.deployModelContent.subscribe(content => this.content = content)
    );
  }

  /**
   * Deploy process
   *
   * @param     id - id of the process
   * */
  deployProcess(id: number) {
    this.deployService.deploying.next(id);
    this.deployService.deploy(id).subscribe((res) => {
        if (res['status'] === 200) {
            const processes = this.processService.processes.getValue();
            processes[id].deploy = 'true';
            this.processService.processes.next(processes);
            $('#switch-' + id).trigger('click');
            this.alert.alert.next(new Alert('Process \'' + this.content['name'] + '\' successfully deployed.', 'success', '', true, false));
        } else {
            this.alert.alert.next(new Alert('Process \'' + this.content['name'] + '\' could not be deployed.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
        }
        this.deployService.deploying.next(0);
    });
  }

  /**
   * Undeploy process
   *
   * @param     id - id of the process
   * */
  undeployProcess(id) {
      this.deployService.deploying.next(id);
      this.deployService.undeploy(id).subscribe((res) => {
          if (res['status'] === 200) {
              const processes = this.processService.processes.getValue();
              processes[id].deploy = 'false';
              this.processService.processes.next(processes);
              $('#switch-' + id).trigger('click');
              this.alert.alert.next(new Alert('Process \'' + this.content['name'] + '\' successfully undeployed.', 'success', ' ', true, false));
          } else {
              this.alert.alert.next(new Alert('Process \'' + this.content['name'] + '\' could not be undeployed.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
          }
          this.deployService.deploying.next(0);
      });
  }

  /**
   * On destroy, unsubscribe all subscriptions
   * */
  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
