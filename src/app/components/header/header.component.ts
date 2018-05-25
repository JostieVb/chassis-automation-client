import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { Router } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { GuardService } from '../../auth/guard.service';
import { AlertService } from '../services/alert.service';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  /**
   * loggedIn     :   boolean whether the user is logged in or not
   * users        :   an array that holds all users
   * user         :   an array that holds all the data from the currently authenticated user
   * subs         :   component subscriptions
   * */
  protected loggedIn: boolean;
  protected users = [];
  protected user = [];
  protected toggle = false;
  private subs = [];

  constructor(
      private auth: UserService,
      private router: Router,
      private sidebar: SidebarService,
      private guard: GuardService,
      private alert: AlertService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.auth.loggedIn.subscribe(status => this.loggedIn = status),
      this.auth.getAuthUser().subscribe(user => this.user = user),
      this.auth.getUsers(false).subscribe(users => this.users = users),
      this.sidebar.toggle.subscribe(toggle => this.toggle = toggle)
    );
  }

  /**
   * Log in to another account
   *
   * @param   email - the account's e-mail address
   * */
  switchAccount(email: string) {
    this.router.navigateByUrl('/dashboard');
    this.auth.loggingOut.next(true);
    this.auth.logOut();
    this.auth.logIn(email, 'admin', true);
  }

  /**
   * Log the current user out
   *
   * */
  logOut() {
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  /**
   * Hide or show the sidebar
   *
   * */
  toggleSidebar() {
    this.sidebar.toggle.next(!this.sidebar.toggle.getValue());
  }

  /**
   * Unsubscribe all component subscriptions when the component gets destoyed
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
