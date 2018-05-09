import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../auth/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  protected signingIn = false;
  protected email;
  protected errorMsg = '';
  protected password;
  protected loggedIn = false;
  protected rememberLogin = true;
  subs = [];

  constructor(private auth: UserService) { }

  ngOnInit() {
    this.subs.push(
        this.auth.loggedIn.subscribe(bool => {
          this.loggedIn = bool;
          console.log(bool);
        }),
        this.auth.errorMsg.subscribe(errorMsg => this.errorMsg = errorMsg),
        this.auth.signingIn.subscribe(signingIn => this.signingIn = signingIn)
    );
    if (localStorage.getItem('ca_remember_login') !== null) {
      if (localStorage.getItem('ca_remember_login') === 'true') {
          this.rememberLogin = true;
      } else {
          this.rememberLogin = false;
      }
    }
  }

  login() {
    this.auth.errorMsg.next('');
    this.auth.logIn(this.email, this.password, this.rememberLogin);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
