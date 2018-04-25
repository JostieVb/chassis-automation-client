import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import 'rxjs/add/operator/map';
import { UserService } from '../../auth/user.service';

@Injectable()
export class ProcessService {
  public processName = new BehaviorSubject<string>('');
  public processCode = new BehaviorSubject<string>('');
  public processes: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor (
      private http: HttpClient,
      private auth: UserService
  ) { }

  newProcess(name, code, xml, properties, callers) {
    return this.http.post(API_BASE + 'processes/new',
    {name: name, code: code, process_xml: xml, properties: JSON.stringify(properties), callers},
    {headers: this.auth.authHeaders()}
    );
  }

  getProcesses() {
    this.http.get(API_BASE + 'processes', {
      headers: this.auth.authHeaders()
    }).subscribe(processes => {
      this.processes.next(processes);
    });
  }

  saveProcess(id, name, code, xml, properties, callers) {
    return this.http.post(API_BASE + 'processes/save',
    {id: id, name: name, code: code, process_xml: xml, properties: JSON.stringify(properties), callers},
    {headers: this.auth.authHeaders()}
        );
  }
}
