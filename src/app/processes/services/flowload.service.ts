import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { UserService } from '../../auth/user.service';

@Injectable()
export class FlowLoadService {
  public process: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
      private http: HttpClient,
      private router: Router,
      private auth: UserService
  ) { }

  load(id) {
      return this.http.get(
          API_BASE + 'get-process/' + id,
          {headers: this.auth.authHeaders()}
      );
  }
}
