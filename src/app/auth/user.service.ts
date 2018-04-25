import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE, BACKEND_BASE } from '../global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  /**
   * token          :       Bearer token
   * loggedIn       :       Bool if user is logged in
   * loggingOut     :       Bool if user is logging out
   * errorMsg       :       Login error message
   * signingIn      :       Bool if user is logging in
   * permissions    :       Comma separated string of current user's permissions
   * */
  public token: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggingOut: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public errorMsg: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public signingIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public permissions: BehaviorSubject<string> = new BehaviorSubject<any>('');

  constructor(
      private http: HttpClient,
      private router: Router
  ) { }

  /**
   * Retrieve a Bearer token and try to log in
   *
   * @param email           email
   * @param password        password
   * @param rememberLogin   true|false
   */
  logIn(email: string, password: string, rememberLogin: boolean) {
    this.signingIn.next(true);

    // Set required data to retrieve token
    const data = {
      'grant_type': 'password',
      'client_id': 2,
      'client_secret': 'SUzG7xjcVOzJIXOPYWqyGkQy4Uu6gpHpKEr9ee0D',
      'username': email,
      'password': password,
      'scope': '',
    };

    // Request Bearer token
    this.http.post(BACKEND_BASE + 'oauth/token', JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).subscribe(
      res => {
        // Set token and logged in status
        this.token.next(res['access_token']);
        this.loggedIn.next(true);

        // Set permissions of user
        this.getAuthUser().subscribe(user => {
            this.permissions.next(user['permissions']);
        });

        // Save token and remember option in localStorage
        localStorage.setItem('ca_user_token', res['access_token']);
        localStorage.setItem('ca_remember_login', 'false');
        if (rememberLogin) {
            localStorage.setItem('ca_remember_login', 'true');
        }

        // Reset status checks and redirect the user
        this.signingIn.next(false);
        this.loggingOut.next(false);
        this.router.navigateByUrl('/');
      },
    err => {
        // Reset status checks and set error message
        this.signingIn.next(false);
        this.loggingOut.next(false);
        this.errorMsg.next(err.error.message);
      }
    );
  }

  /**
   * Log the user out
   */
  logOut() {
      this.token.next(null);
      this.loggedIn.next(false);
      localStorage.setItem('ca_remember_login', 'false');
      localStorage.removeItem('ca_user_token');
  }

  /**
   * Get authenticated user's data
   *
   * @return    observable user
   */
  getAuthUser(): Observable<any> {
      return this.http.get(
          API_BASE + 'user',
          {headers: this.authHeaders()}
      );
  }

  /**
   * Get all users
   *
   * @param     exceptCurrentUser
   * @return    observable users
   */
  getUsers(exceptCurrentUser?: boolean): Observable<any> {
      if (exceptCurrentUser) {
          return this.http.get(API_BASE + 'users/true', {headers: this.authHeaders()});
      }
      return this.http.get(API_BASE + 'users', {headers: this.authHeaders()});
  }

  /**
   * Get authenticated user's permissions
   *
   * @return    observable users
   */
  getUserPermissions() {
      return this.http.get(
          API_BASE + 'user-permissions',
          {headers: this.authHeaders()}
      );
  }

  /**
    * Set headers for authentication
    *
    * @return    HttpHeaders
    */
  authHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.token.getValue()
    });
  }

  /**
    * Decode the access token
    *
    * @param    token
    * @return   HttpHeaders
    */
  decodeAccessToken(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(['-', '+']).replace(['_', '/']);
      return JSON.parse(window.atob(base64));
  }

}
