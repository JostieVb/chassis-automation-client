import { Component, OnInit } from '@angular/core';
import { DeployService } from '../../services/deploy.service';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.scss']
})
export class DeployComponent implements OnInit {

  subs = [];
  protected content = {};
  protected deployment: any;

  constructor(private  deployService: DeployService) { }

  ngOnInit() {
    this.subs.push(
        this.deployService.deployModelContent.subscribe(content => this.content = content),
        this.deployService.deployment.subscribe(deployment => this.deployment = deployment)
    );
  }

  deployProcess(id) {
    this.deployService.deploy(id).subscribe((res) => {
        if (res['status'] === 200) {
            const deployment = this.deployment;
            deployment[id] = 'true';
            this.deployService.deployment.next(deployment);
            $('#switch-' + id).trigger('click');
        }
    });
  }

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

}
