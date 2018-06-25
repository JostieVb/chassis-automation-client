import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectedProperty } from '../models/selected-property';
import { IOption } from 'ng-select';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PropertiesService {

  /**
   * selectedPropertyIdAndType      :       an object that holds the id and type of the selected item
   * registereProperties            :       an object that holds all registered properites
   * properties                     :       an object that holds all properties
   * keys                           :       an object that holds all keys of the selected item's properties for iteration
   * getSequence                    :       boolean that indicates whether the sequence should be gathered in the modeler component
   * sequence                       :       an object that holds the process' sequence
   * */
  public selectedPropertyIdAndType: BehaviorSubject<SelectedProperty> = new BehaviorSubject<SelectedProperty>(new SelectedProperty('', ''));
  public showDecisions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public decisions: BehaviorSubject<Array<IOption>> = new BehaviorSubject<Array<IOption>>([]);
  public properties: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public keys: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public updateNativeProperty: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public getNativeProperty: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public nativeProperty: BehaviorSubject<any> = new BehaviorSubject<any>('');

  public getNativeType: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public nativeType: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public getSequence: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public sequence: BehaviorSubject<any> = new BehaviorSubject<any>('');

  public getProcessItems: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public processItems: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private http: HttpClient,
    private auth: UserService
  ) {}

  /**
   * Write changes to the properties object
   *
   * @param     id - id of the edited property's item
   * @param     type - type of the edited item
   * @param     field - edited field
   * @param     value - new value
   * */
  updateProperties(id: string, type: string, field: string, value: any) {
    const properties = this.properties.getValue();
    if (!(id in properties)) {
      properties[id] = {
        id: id,
        type: type,
      };
    }
    properties[id][field] = value;
    this.properties.next(properties);
  }

  /**
   * Remove non-existing items from the properties object
   *
   * @param     properties - the properties object
   * @return    object - the cleaned properties object
   * */
  cleanProperties(properties: any): Observable<any> {
    this.getProcessItems.next(true);
    this.processItems.subscribe(processItems => {
      console.log(processItems);
      Object.keys(properties).forEach(id => {
        if (processItems.indexOf(id) === -1) {
          console.log('delete \'' + id + '\'');
          // delete properties[id];
        }
      });
    });
    this.properties.next(properties);
    console.log(properties);
    return this.properties;
  }

}
