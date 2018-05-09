import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';

@Injectable()
export class FormLoadService {

  constructor(
    private http: HttpClient,
    private auth: UserService
  ) { }

  /**
   * Load the form structure
   *
   * @param     form - name of the form
   * */
  load(form) {
    return this.http.get(API_BASE + 'form/' + form,
        {headers: this.auth.authHeaders()}
    );
  }

}
