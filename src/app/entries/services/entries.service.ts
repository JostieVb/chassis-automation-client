import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Entry } from '../models/entry';

@Injectable()
export class EntriesService {
    public entries = new BehaviorSubject<Entry[]>([
        {id: 1, title: 'New product added', date: new Date(2018, 3, 20, 11, 1, 15, 0), label: 'Check entry', status_code: 0, text: 'blabla'},
        {id: 1, title: 'New product added', date: new Date(2018, 3, 20, 11, 1, 15, 0), label: 'Check entry', status_code: 0, text: 'blabla'}
    ]);

  constructor() { }

}
