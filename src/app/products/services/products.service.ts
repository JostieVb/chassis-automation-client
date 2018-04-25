import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';

@Injectable()
export class ProductsService {
  public products: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  getProducts() {
    this.http.get(
        API_BASE + 'products',
        {headers: this.auth.authHeaders()}
    ).subscribe(products => this.products.next(products));
  }

  addProduct(product: Product) {
    return this.http.post(
        API_BASE + 'products/add',
        {product: JSON.stringify(product)},
        {headers: this.auth.authHeaders()}
    );
  }
}
