import { Component, OnInit, OnDestroy } from '@angular/core';
import { BpmnService } from '../../../bpmn/services/bpmn.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-products-overview',
  templateUrl: './products-overview.component.html',
  styleUrls: ['./products-overview.component.scss']
})
export class ProductsOverviewComponent implements OnInit, OnDestroy {
  /**
   * products   :   all products
   * subs       :   component subscriptions
   * */
  protected content = [];
  protected structure = [];
  protected structureKeys = [];
  private subs = [];

  constructor(
      private bpmn: BpmnService
  ) { }

  /**
   * On initialization, subscribe to the data from the bpmnService
   * */
  ngOnInit() {
    this.subs.push(
      this.bpmn.data.subscribe(data => {
          const structure = data['structure'];
          const content = data['content'];
          if (structure !== undefined) {
              this.structure = structure;
              this.structureKeys = Object.keys(structure);
          }
          if (content !== undefined) {
              this.content = [];
              for (const item of content) {
                  this.content.push(item['data']);
              }
          }
      })
    );
    this.bpmn.getData('form-new-product');
  }

  /**
   * On destroy, unsubscribe all subscriptions
   * */
  ngOnDestroy() {
    this.bpmn.data.next([]);
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
