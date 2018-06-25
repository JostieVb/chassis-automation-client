import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BpmnService {

  public data: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Call to the back-end bpmn engine
   *
   * */
  call(caller: string, insertId?: number): Observable<any> {
    return this.http.post(API_BASE + 'call',
        {caller: caller, insertId: insertId},
        {headers: this.auth.authHeaders()}
        );
  }

  /**
   * Post the form data
   *
   * @param     form - name of the form
   * @param     data - form data
   * */
  postData(form, data) {
    return this.http.post(
       API_BASE + 'post/' + form,
       data,
      {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Get data from table
   *
   * @param     dataName - the name of the data that should be displayed
   * */
  getData(dataName: string) {
      this.http.get(
          API_BASE + 'get-data/' + dataName,
          {headers: this.auth.authHeaders()}
      ).subscribe(data => this.data.next(data));
  }
}
