import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';

@Injectable()
export class DeployService {

  /**
   * deployModelContent       :   the content that should be displayed in the modal
   * deployment               :   indicates if a process should be deployed or undeployed
   * */
  public deployModelContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public deployment: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Deploy a process
   *
   * @param   id - process id
   * @return  Observable<any>
   * */
  deploy(id: number) {
    return this.http.get(
        API_BASE + 'deploy/' + id,
        {headers: this.auth.authHeaders()}
    );
  }


  /**
   * Undeploy a process
   *
   * @param   id - process id
   * @return  Observable<any>
   * */
  undeploy(id: number) {
    return this.http.get(
        API_BASE + 'undeploy/' + id,
        {headers: this.auth.authHeaders()}
    );
  }
}
