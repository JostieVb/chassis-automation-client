import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanComponentDeactivate } from './can-component-deactivate';
import { UserService } from './user.service';

@Injectable()
export class GuardService implements CanActivate, CanDeactivate<CanComponentDeactivate> {

  constructor(
      private auth: UserService
  ) {}

  /**
   * Decide whether the authenticated user has the right to activate a route
   *
   * */
  canActivate(route: ActivatedRouteSnapshot) {
    console.log(route);
    let url = 'dashboard';
    if (route.url.length > 0) {
      url = route.url[0].path;
    }

    const permissions = this.auth.permissions.getValue();
    if (permissions.includes(url)) {
      return true;
    }
    return false;
  }

  /**
   * Decide whether a component can be deactivated
   *
   * */
  canDeactivate(
    component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}
