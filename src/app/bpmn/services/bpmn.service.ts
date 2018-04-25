import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../auth/user.service';

@Injectable()
export class BpmnService {

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Check for processes that are linked to the caller
   * */
  call(caller: string, dbTable?: string, insertId?: number): Observable<any> {
    return this.http.post(API_BASE + 'call',
        {caller: caller, dbTable: dbTable, insertId: insertId},
        {headers: this.auth.authHeaders()}
        );
  }

  postData(caller, data) {
    return this.http.post(
       API_BASE + 'post/' + caller,
       data,
      {headers: this.auth.authHeaders()}
    );
  }

  getData(dbTable, contentId) {
    return this.http.post(
        API_BASE + 'get-data',
        {db_table: dbTable, content_id: contentId},
        {headers: this.auth.authHeaders()}
    );
  }

  getProcess(id) {
    return this.http.get(
        API_BASE + 'entries-get-process/' + id,
        {headers: this.auth.authHeaders()}
    );
  }
}
