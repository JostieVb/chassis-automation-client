import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import 'rxjs/add/operator/map';
import { UserService } from '../../auth/user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProcessService {

  /**
   * processName              :   name of the process
   * processCode              :   code of the process
   * processCaller            :   caller of the process
   * processes                :   an array that holds all processes
   * forms                    :   all forms that are created with the form builder
   * showKeyboardShortcuts    :   indicates whether the keyboardshortcuts should be shown
   * */
  public processName = new BehaviorSubject<string>('');
  public processCode = new BehaviorSubject<string>('');
  public processCaller = new BehaviorSubject<string>('');
  public processes: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public forms: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public loadingProcesses: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showKeyboardShortcuts: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
   * @param   caller - the form that can activate the process
   * @return  Observable<any>
   * */
  newProcess(name: string, code: string, xml: any, properties: any, caller: string) {
    return this.http.post(API_BASE + 'processes/new',
    {name: name, code: code, process_xml: xml, properties: JSON.stringify(properties), caller: caller},
    {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Get all processes
   *
   * */
  getProcesses() {
    this.loadingProcesses.next(true);
    this.http.get(API_BASE + 'processes', {
      headers: this.auth.authHeaders()
    }).subscribe(processes => {
      this.processes.next(processes);
      this.loadingProcesses.next(false);
    });
  }

  /**
   * Get all forms that can be linked as callers to a process
   *
   * */
  getForms(): Observable<any> {
    return this.http.get(
    API_BASE + 'processes/get-forms',
    {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Get all users that can be assigned to a task
   *
   * */
  getUsers(): Observable<any> {
    return this.http.get(
    API_BASE + 'processes/get-users',
    {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Save an existing process
   *
   * @param   id - selected process id
   * @param   name - process name
   * @param   code - process code
   * @param   xml - the xml object where the process is saved
   * @param   properties - a json object that holds all process properties
   * @param   caller - the form that can activate the process
   * @return  Observable<any>
   * */
  saveProcess(id: number, name: string, code: string, xml: any, properties: any, caller: string): Observable<any> {
    return this.http.post(API_BASE + 'processes/save',
    {id: id, name: name, code: code, process_xml: xml, properties: JSON.stringify(properties), caller: caller},
    {headers: this.auth.authHeaders()}
     );
  }

  /**
   * Check if a process with the given code already exists
   *
   * @param   code - the unique code of the process
   * @return  boolean
   * */
  checkUniqueProcessCodeExists(code: string): Observable<any> {
    return this.http.post(
    API_BASE + 'processes/check-process-code',
    {code: code},
    {headers: this.auth.authHeaders()}
    );
  }
}
