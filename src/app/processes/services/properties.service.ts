import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PropertiesService {

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Generate an array of data for the property
   *
   * @param     id - id of the item
   * @param     type - type of the item
   * @param     sequence - process sequence
   *
   * */
  generatePropertiesByType(id: string, type: string, sequence: any) {
    const property = {id: id, type: type};
    switch (type) {
        case 'startevent':
            property['caller'] = 'none';
          break;
        case 'exclusivegateway':
            property['predecessor'] = '';
            property['output'] = [];
            let source;
            for (const item of sequence) {
                if (item['sourceRef'] === id) {
                    property['output'].push({id: item['targetRef'], value: ''});
                }
                if (item['targetRef'] === id) {
                    source = item['sourceRef'];
                }
            }
            property['predecessor'] = source;
          break;
        case 'task':
            property['assignees'] = ['none'];
            property['decisions'] = [];
            property['title'] = '';
            property['message'] = '';
            break;
        default:
            break;
    }
    return property;
  }

  /**
   * Return an array of properties help messages
   * ---------------------------------------------------
   * The key of the message should correspond to
   * the name of the property where the helper info
   * should be displayed.
   *
   * */
  helpers() {
    return {
        id: 'The identifier is unique and can\'t be modified.',
        type: 'This is the type of the selected item.',
        caller: 'A \'caller\' is a form that initiates a process or event.',
        assignees: 'Determine the users that are assigned to this event.',
        decisions: 'Offer the decisions that can be chosen by the assigned user.',
        title: 'The title of the message that will be received by the assignee(s).',
        message: 'Enter a message that will be received by the assignee(s).',
        predecessor: 'The predecessor of the exclusive gateway where the decisions are described.',
        output: 'Link a certain decision to the desired descendant.',
        enclosure: 'Enclose a message from a previous task.'
    };
  }

  /**
   * Get all forms that were created with the form builder
   *
   * @return    Observable
   * */
  getForms(): Observable<any> {
      return this.http.get(API_BASE + 'forms/get-forms', {headers: this.auth.authHeaders()});
  }

  /**
   * Get predecessor of selected item
   *
   * @param     id - id of item
   * @param     sequence - process sequence
   * @return    string
   * */
  getPredecessor(id: string, sequence: any) {
    for (const item of sequence) {
      if (item['targetRef'] === id) {
        return item['sourceRef'];
      }
    }
    return;
  }

  /**
   * Get descendant of selected item
   *
   * @param     id - id of the item
   * @param     sequence - process sequence
   * @return    array
   * */
  getDescendants(id: string, sequence: any) {
    const descendants = [];
    for (const item of sequence) {
      if (item['sourceRef'] === id) {
          descendants.push(item['targetRef']);
      }
    }
    return descendants;
  }

}
