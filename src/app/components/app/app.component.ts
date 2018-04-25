import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { EntriesService } from '../../entries/services/entries.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  protected loggedIn: boolean;
  protected loggingOut: boolean;
  private user = [];
  private subs = [];

  constructor(
      private auth: UserService,
      private router: Router,
      private entriesService: EntriesService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.auth.loggedIn.subscribe(bool => this.loggedIn = bool ),
      this.auth.loggingOut.subscribe(bool => this.loggingOut = bool),
      this.auth.getAuthUser().subscribe(user => {this.user = user; console.log(user);}),
      this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.entriesService.countUnreadEntries();
          }
      })
    );
    this.readLocalStorage();
  }

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

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
