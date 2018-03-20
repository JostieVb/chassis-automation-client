import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlowLoadService } from '../../services/flowload.service';
import { ActivatedRoute } from '@angular/router';
import { ProcessService } from '../../../processes/services/process.service';

declare var require: any;
const Modeler = require('bpmn-js/lib/Modeler');

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css']
})
export class ModelerComponent implements OnInit, OnDestroy {
  /**
  * diagramBase :   base path to diagrams directory
  * url         :   path to mock diagram
  * param       :   id:number ? 'new':string
  * processes   :   received processes
  * subs        :   component subscriptions
  * */

  private diagramBase = 'assets/resources/diagrams/';
  private param: any;
  private processes = [];
  private subs = [];

  constructor(
    private http: HttpClient,
    private flowLoader: FlowLoadService,
    private route: ActivatedRoute,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.route.params.subscribe(res => this.param = res['param']),
      this.processService.processes.subscribe(res => this.processes = res)
    );

    if (this.param !== 'new') {
      this.load(this.param);
    }
  }

  load(id) {
    const file = this.processes.filter(e => e.id == id)[0].file;
    this.subs.push(
      this.flowLoader.load(this.diagramBase + file).subscribe(
        res => viewer.importXML(res, function(err) {
          if (err) { console.log(err); }
        })
      )
    );

    const viewer = new Modeler({
        container: '#canvas'
    });
  }

  ngOnDestroy() {
    this.subs.forEach(function(sub) {
      sub.unsubscribe();
    });
  }

}
