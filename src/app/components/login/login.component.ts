import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../auth/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  /**
   * signingIn      :     indicates if the system is signing in a user
   * email          :     bound to the e-mail input field
   * password       :     bound to the password input field
   * errorMsg       :     the error message that should be displayed
   * loggedIn       :     a boolean that indicates if a user is logged in
   * rememberLogin  :     a boolean that indicates if the user should be remembered
   * subs           :     component subscriptions
   * */
  protected signingIn = false;
  protected email;
  protected password;
  protected errorMsg = '';
  protected loggedIn = false;
  protected rememberLogin = true;
  private subs = [];

  constructor(
    private auth: UserService
  ) { }

  /**
   * On component initialization, check if a user should be logged in
   *
   * */
  ngOnInit() {
    this.subs.push(
        this.auth.loggedIn.subscribe(bool => {
          this.loggedIn = bool;
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

  /**
   * Try to log the user in
   *
   * */
  login() {
    this.auth.errorMsg.next('');
    this.auth.logIn(this.email, this.password, this.rememberLogin);
  }

  /**
   * When the component get's destroyed, unsubscribe all component subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
