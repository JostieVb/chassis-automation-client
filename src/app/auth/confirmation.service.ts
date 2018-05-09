import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ConfirmationService {

  constructor() { }

  /**
   * Prompt the user before leaving a component
   *
   * @param     message - an optional message to prompt
   * @return    observable<boolean>
   * */
  confirm(message?: string): Observable<boolean> {
      const confirmation = window.confirm(message || 'Are you sure you want to leave this page?');
      return Observable.of(confirmation);
  }

}
