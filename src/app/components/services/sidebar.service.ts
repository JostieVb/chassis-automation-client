import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SidebarService {

  /**
   * toggle     :     the state of the sidebar (responsive)
   * */
  public toggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

}
