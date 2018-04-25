import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SidebarService {
  public hideSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

}
