import {Component, OnDestroy, OnInit} from '@angular/core';
import { DeployService } from '../../services/deploy.service';

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
   * deployment         :       indicates if the process will be deployed or undeployed
   * subs               :       modal subscriptions
   * */
  protected content = {};
  protected deployment: any;
  private subs = [];

  constructor(
    private  deployService: DeployService
  ) { }

  /**
   * On initialization, subscribe to the data from the deployService
   *
   * */
  ngOnInit() {
    this.subs.push(
        this.deployService.deployModelContent.subscribe(content => this.content = content),
        this.deployService.deployment.subscribe(deployment => this.deployment = deployment)
    );
  }

  /**
   * Deploy process
   *
   * @param     id - id of the process
   * */
  deployProcess(id: number) {
    this.deployService.deploy(id).subscribe((res) => {
        if (res['status'] === 200) {
            const deployment = this.deployment;
            deployment[id] = 'true';
            this.deployService.deployment.next(deployment);
            $('#switch-' + id).trigger('click');
        }
    });
  }

  /**
   * Undeploy process
   *
   * @param     id - id of the process
   * */
  undeployProcess(id) {
      this.deployService.undeploy(id).subscribe((res) => {
          if (res['status'] === 200) {
              const deployment = this.deployment;
              deployment[id] = 'false';
              this.deployService.deployment.next(deployment);
              $('#switch-' + id).trigger('click');
          }
      });
  }

  /**
   * On destroy, unsubscribe all subscriptions
   * */
  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
