import { Injectable } from '@angular/core';
import { Process } from '../models/process';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProcessService {
  public processes = new BehaviorSubject<Process[]>([
      {id: 1, name: 'Pizza Delivery Example', initComp: 'ProductsFormComponents', file: 'pizza-delivery.bpmn' },
      {id: 2, name: 'Test', initComp: 'ProductsFormComponents', file: 'test.bpmn' }
  ]);

  constructor() { }

}
