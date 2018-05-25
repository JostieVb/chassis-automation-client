import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Alert } from '../alert/alert';

@Injectable()
export class AlertService {

  /**
   * alert    :   the variable where the alert message is being stored.
   * */
  public alert: BehaviorSubject<Alert> = new BehaviorSubject<Alert>(new Alert('', ''));

  constructor() { }

}
