import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { EntriesService } from '../../entries/services/entries.service';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * loggedIn     :   whether the user is logged in
   * loggingOut   :   whether the application is doing a logout
   * subs         :   component subscriptions
   * */
  protected loggedIn: boolean;
  protected loggingOut: boolean;
  protected toggle = false;
  private subs = [];

  constructor(
      private auth: UserService,
      private router: Router,
      private entriesService: EntriesService,
      private sidebar: SidebarService
  ) { }

  /**
   * On component initialization, count unread entries and set
   * loggedIn to true if the user is authenticated
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.auth.loggedIn.subscribe(bool => this.loggedIn = bool),
      this.auth.loggingOut.subscribe(bool => this.loggingOut = bool),
      this.sidebar.toggle.subscribe(toggle => this.toggle = toggle),
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd && this.auth.loggedIn.getValue() === true) {
          this.sidebar.toggle.next(false);
          this.entriesService.countUnreadEntries();
        }
      })
    );
    this.readLocalStorage();
  }

  /**
   * Read localstorage to get the user token
   *
   * */
  private readLocalStorage() {
    if (localStorage.getItem('ca_remember_login') === 'true' && localStorage.getItem('ca_user_token') !== null) {
      this.auth.token.next(localStorage.getItem('ca_user_token'));
      this.auth.loggedIn.next(true);
      this.subs.push(this.auth.getAuthUser().subscribe(user => {
        this.auth.permissions.next(user['permissions']);
      }));
      this.auth.getUsers(true);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  /**
   * Unsubscribe all of the component subscriptions on destroy
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
