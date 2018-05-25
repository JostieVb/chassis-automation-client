import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';

@Injectable()
export class DeleteService {

  /**
   * content      :   the content that should be displayed in the modal
   * */
  content: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Delete process
   *
   * @param   id - the process id
   * @return  Observable<any>
   * */
  deleteProcess(id: number) {
    return this.http.get(
        API_BASE + 'delete-process/' + id,
        {headers: this.auth.authHeaders()}
    );
  }
}
