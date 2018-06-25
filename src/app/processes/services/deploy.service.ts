import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';

@Injectable()
export class DeployService {

  /**
   * deployModelContent       :   the content that should be displayed in the modal
   * deploying                :   holds the id of the process that is currently deploying/undeploying
   * */
  public deployModelContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public deploying: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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
