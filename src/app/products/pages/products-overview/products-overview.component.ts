import { Component, OnInit, OnDestroy } from '@angular/core';
import { BpmnService } from '../../../bpmn/services/bpmn.service';

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
  protected products: any;
  private subs = [];

  constructor(
      private bpmn: BpmnService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.bpmn.data.subscribe(data => this.products = data)
    );
    this.bpmn.getData('ca_product');
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
