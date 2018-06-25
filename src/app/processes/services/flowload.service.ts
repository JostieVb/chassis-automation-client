import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { UserService } from '../../auth/user.service';

@Injectable()
export class FlowLoadService {

  /**
   * previewLoaded    :   indicates whether the flowloader is finished loading the preview
   * process          :   the loaded process for the modeler
   * loadingPreview   :   indicates if the flowloader is loading a preview
   * */
  public previewLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public process: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public loadingPreview: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private http: HttpClient,
      private router: Router,
      private auth: UserService
  ) { }

  /**
   * Load a process
   *
   * @param     id - the id of the process
   * @return    Observable<any>
   * */
  load(id: number) {
      return this.http.get(
          API_BASE + 'get-process/' + id,
          {headers: this.auth.authHeaders()}
      );
  }
}
