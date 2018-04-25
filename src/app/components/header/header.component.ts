import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  protected loggedIn;
  protected users = [];
  protected user = '';
  private subs = [];

  constructor(
      private auth: UserService,
      private router: Router
  ) { }

  ngOnInit() {
    this.subs.push(
      this.auth.loggedIn.subscribe(status => this.loggedIn = status),
      this.auth.getAuthUser().subscribe(user => this.user = user),
      this.auth.getUsers(true).subscribe(users => this.users = users)
    );
  }

  switchAccount(email) {
    this.auth.loggingOut.next(true);
    this.auth.logOut();
    this.auth.logIn(email, 'admin', true);
  }

  logOut() {
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
