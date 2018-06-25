import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntriesService } from '../../services/entries.service';
import { EntryResponse } from '../../models/entry-response';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';
import { UserService } from '../../../auth/user.service';
import { Entry } from '../../models/entry';
import { CUSTOM_QUILL_MODULES } from '../../../processes/pages/properties-panel/templates/task/custom-quill-modules';

@Component({
  selector: 'app-entries-detail',
  templateUrl: './entries-detail.component.html',
  styleUrls: ['./entries-detail.component.scss']
})
export class EntriesDetailComponent implements OnInit, OnDestroy {

  /**
   * loading            :   indicates if an entry is being loaded
   * selectedEntryId    :   the ID of the selected entry
   * entry              :   an entry object
   * response           :   an entry response object
   * heightAuto         :   whether the entry table is expanded or not
   * subs               :   component subscriptions
   * */
  protected loading = false;
  protected selectedEntryId = null;
  protected entry: Entry = new Entry();
  protected response = new EntryResponse();
  protected heightAuto = false;
  protected showReply = false;
  protected selectedAttachment = 0;
  protected attachment = {fields: [], keys: {}, values: {}};
  protected quillModules = CUSTOM_QUILL_MODULES;
  private subs = [];

  constructor(
      private entriesService: EntriesService,
      private auth: UserService,
      private http: HttpClient
  ) { }

  /**
   * On component initializatoin, subscribe to important data from the service
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.entriesService.entry.subscribe(entry => {
        this.entry = entry;
        this.attachment = {fields: [], keys: {}, values: {}};
        this.selectedAttachment = 0;
      }),
      this.entriesService.loading.subscribe(loading => this.loading = loading),
      this.entriesService.selectedEntryId.subscribe(selectedEntryId => this.selectedEntryId = selectedEntryId),
      this.entriesService.heightAuto.subscribe(heightAuto => this.heightAuto = heightAuto),
      this.entriesService.response.subscribe(response => this.response = response)
    );
  }

  /**
   * Expand or contract the entry message's table
   *
   * */
  toggleContent() {
    this.entriesService.heightAuto.next(!this.heightAuto);
  }

  /**
   * Delete an entry
   *
   * */
  deleteEntry(id) {
    this.http.post(
        API_BASE + 'delete-entry',
        {entry_id: id},
        {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Send response to entry
   *
   * @param   id - id of the entry
   * @param   caller - name of the caller that is connected to the process
   * @param   taskId - name of the current task
   * @param   contentId - id of the content in the entry
   * */
  sendResponse(id: number, caller: string, taskId: string, contentId: number) {
    if (this.response.decision !== '') {
      this.http.post(
          API_BASE + 'call',
          {entry_id: id, caller: caller, current_task: taskId, data: this.response, insertId: contentId},
          {headers: this.auth.authHeaders()}
      ).subscribe(res => this.updateStatus(id));
    }
  }

  /**
   * Update the status of the entry
   *
   * @param   id - id of the entry
   * */
  updateStatus(id: number) {
    const entries = this.entriesService.entries.getValue();
    const entry = this.entriesService.entry.getValue();
    entry['label'] = 'Completed';
    entry['status'] = 'completed';
    console.log(entry);
    for (const ent of entries) {
      if (ent['id'] === id) {
          ent['status'] = 'completed';
          ent['label'] = 'Completed';
      }
    }
    this.entriesService.entry.next(entry);
    this.entriesService.entries.next(entries);
  }

  /**
   * A back button for touch devices to go back
   * to the entry-overview
   *
   * */
  backResponsive() {
    this.entriesService.showDetail.next(false);
    this.dismissEntry();
  }

  /**
   * Load the content of the attachment
   *
   * @param   id - id of the attachment
   * @param   type - type of the attachment
   * @param   form - the form that is attached to the process
   * */
  loadAttachment(id: number, type: string, form: string) {
    if (this.selectedAttachment !== id) {
      if (type === 'form-contents') {
          this.entriesService.loadAttachedFormContents(id, form).subscribe(attachment => {
              this.attachment = {fields: [], keys: {}, values: {}};
              if ('keys' in attachment) {
                  this.selectedAttachment = id;
                  this.attachment['fields'] = Object.keys(attachment['keys']);
                  this.attachment['keys'] = attachment['keys'];
                  this.attachment['values'] = attachment['values'];
              }
          });
      } else {
          // Not implemented yet.
          console.log('load attachment');
      }
    }
  }

  /**
   * Dismiss the attachment that is currently opened
   *
   * */
  dismissAttachment() {
    this.attachment = {fields: [], keys: {}, values: {}};
    this.selectedAttachment = 0;
  }

  /**
   * Dismiss the entry that is currently opened
   *
   * */
  dismissEntry() {
    this.entriesService.entry.next([]);
    this.entriesService.selectedEntryId.next(null);
    this.entriesService.heightAuto.next(false);
    this.response = new EntryResponse();
    this.entriesService.showDetail.next(false);
  }

  /**
   * On destroy, clear entries and selected entry and
   * unsubscribe all component subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.entriesService.entry.next([]);
    this.entriesService.entries.next([]);
  }

}
