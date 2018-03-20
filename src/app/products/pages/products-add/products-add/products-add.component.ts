import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-products-add',
  templateUrl: './products-add.component.html',
  styleUrls: ['./products-add.component.scss']
})
export class ProductsAddComponent implements OnInit, OnDestroy {

  /**
   * name       :   form field of name
   * descr      :   form field of description
   * products   :   all products
   * subs       :   component subscriptions
   * */
  protected name = '';
  protected descr = '';
  private products: any;
  private subs = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.subs.push(
        this.productsService.products.subscribe(products => this.products = products)
    );
  }

  addProduct() {
    if (this.name !== '' && this.descr !== '') {
      const product = new Product();
      product.id = 1;
      product.name = this.name;
      product.descr = this.descr;
      product.status = 'pending';
      this.products.push(product);
      this.name = '';
      this.descr = '';
    }
  }

  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
  }
}
