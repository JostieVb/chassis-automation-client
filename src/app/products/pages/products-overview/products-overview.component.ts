import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';

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

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.subs.push(
      this.productsService.products.subscribe(res => this.products = res)
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
