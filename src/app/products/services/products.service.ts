import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProductsService {
  public products = new BehaviorSubject<Product[]>([]);

  constructor() { }
}
