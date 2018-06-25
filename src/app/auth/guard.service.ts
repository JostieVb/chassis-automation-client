import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanComponentDeactivate } from './can-component-deactivate';
import { UserService } from './user.service';
import 'rxjs/add/operator/filter';

@Injectable()
export class GuardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {

  constructor(
      private auth: UserService,
  ) {
  }

  /**
   * Decide whether the authenticated user has the right to activate a route
   *
   **/
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url = 'dashboard';
    if (route.url.length > 0) {
      url = route.url[0].path;
    }

    const permissions = this.auth.permissions.getValue();
    return permissions.includes(url);
  }

  /**
   * Decide whether a component can be deactivated
   *
   **/
  canDeactivate(
    component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}
