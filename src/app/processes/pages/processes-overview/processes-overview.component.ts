import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProcessService } from '../../services/process.service';

declare var require: any;
const $ = require('jquery/src/jquery');

@Component({
  selector: 'app-processes-overview',
  templateUrl: './processes-overview.component.html',
  styleUrls: ['./processes-overview.component.scss']
})
export class ProcessesOverviewComponent implements OnInit, OnDestroy {
  /*
    * processes :   received processes
    * subs      :   component subscriptions
    * */

  protected processes = [];
  private subs = [];

  constructor(private processService: ProcessService) { }

  ngOnInit() {
    this.subs.push(
      this.processService.processes.subscribe(res => this.processes = res)
    );
  }

  ngOnDestroy() {
    this.subs.forEach(function(sub) {
      sub.unsubscribe();
    });
  }

}
