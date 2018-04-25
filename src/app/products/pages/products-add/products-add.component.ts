import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { UserService } from '../../../auth/user.service';

declare var require;
const $ = require('jQuery');

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
  private subs = [];

  constructor(
      private productsService: ProductsService,
      private auth: UserService
  ) { }

  ngOnInit() {
  }

  addProduct() {
    if (this.name !== '' && this.descr !== '') {
      const product = new Product();
      product.name = this.name;
      product.descr = this.descr;
      this.productsService.addProduct(product).subscribe((res) => {
        if (res['status'] === 200) {
          this.productsService.getProducts();
        }
      });
      this.name = '';
      this.descr = '';
    }
  }

  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
  }
}
