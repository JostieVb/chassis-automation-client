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
  call(caller: string, dbTable?: string, insertId?: number): Observable<any> {
    return this.http.post(API_BASE + 'call',
        {caller: caller, dbTable: dbTable, insertId: insertId},
        {headers: this.auth.authHeaders()}
        );
  }

  /**
   * Post the form data
   *
   * @param     caller - name of the caller
   * @param     data - form data
   * */
  postData(caller, data) {
    return this.http.post(
       API_BASE + 'post/' + caller,
       data,
      {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Get data from table
   *
   * @param     table - the table name where the data should be selected
   * */
  getData(table: string) {
      this.http.get(
          API_BASE + 'get-data/' + table,
          {headers: this.auth.authHeaders()}
      ).subscribe(data => this.data.next(data));
  }
}
