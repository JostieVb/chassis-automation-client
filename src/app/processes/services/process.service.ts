import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import 'rxjs/add/operator/map';
import { UserService } from '../../auth/user.service';

@Injectable()
export class ProcessService {

  /**
   * processName      :   name of the process
   * processCode      :   code of the process
   * processes        :   an array that holds all processes
   * */
  public processName = new BehaviorSubject<string>('');
  public processCode = new BehaviorSubject<string>('');
  public processes: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor (
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Create new process
   *
   * @param   name - process name
   * @param   code - process code
   * @param   xml - the xml object where the process is saved
   * @param   properties - a json object that holds all process properties
   * @param   callers - forms that can activate the process
   * @return  Observable<any>
   * */
  newProcess(name: string, code: string, xml: any, properties: any, callers: any) {
    return this.http.post(API_BASE + 'processes/new',
    {name: name, code: code, process_xml: xml, properties: JSON.stringify(properties), callers},
    {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Get all processes
   * */
  getProcesses() {
    this.http.get(API_BASE + 'processes', {
      headers: this.auth.authHeaders()
    }).subscribe(processes => {
      this.processes.next(processes);
    });
  }

  /**
   * Create new process
   *
   * @param   id - selected process id
   * @param   name - process name
   * @param   code - process code
   * @param   xml - the xml object where the process is saved
   * @param   properties - a json object that holds all process properties
   * @param   callers - forms that can activate the process
   * @return  Observable<any>
   * */
  saveProcess(id: number, name: string, code: string, xml: any, properties: any, callers: any) {
    return this.http.post(API_BASE + 'processes/save',
    {id: id, name: name, code: code, process_xml: xml, properties: JSON.stringify(properties), callers},
    {headers: this.auth.authHeaders()}
        );
  }
}
