import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';

@Injectable()
export class DeployService {
  public deployModelContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public deployment: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  deploy(id) {
    return this.http.get(
        API_BASE + 'deploy/' + id,
        {headers: this.auth.authHeaders()}
    );
  }

  undeploy(id) {
    return this.http.get(
        API_BASE + 'undeploy/' + id,
        {headers: this.auth.authHeaders()}
    );
  }
}
