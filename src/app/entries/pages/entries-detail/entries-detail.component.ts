import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntriesService } from '../../services/entries.service';
import { EntryResponse } from '../../models/entry-response';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';
import { UserService } from '../../../auth/user.service';
import { Entry } from '../../models/entry';

@Component({
  selector: 'app-entries-detail',
  templateUrl: './entries-detail.component.html',
  styleUrls: ['./entries-detail.component.scss']
})
export class EntriesDetailComponent implements OnInit, OnDestroy {

  protected loading = false;
  protected selectedEntryId = null;
  protected entry: Entry = new Entry();
  protected response = new EntryResponse();
  protected heightAuto = false;
  private subs = [];

  constructor(
      private entriesService: EntriesService,
      private auth: UserService,
      private http: HttpClient
  ) { }

  ngOnInit() {
    this.subs.push(
      this.entriesService.entry.subscribe(entry => this.entry = entry),
      this.entriesService.loading.subscribe(loading => this.loading = loading),
      this.entriesService.selectedEntryId.subscribe(selectedEntryId => this.selectedEntryId = selectedEntryId),
      this.entriesService.heightAuto.subscribe(heightAuto => this.heightAuto = heightAuto),
      this.entriesService.response.subscribe(response => this.response = response)
    );
  }

  dismissEntry() {
    this.entriesService.entry.next([]);
    this.entriesService.selectedEntryId.next(null);
    this.entriesService.heightAuto.next(false);
    this.response = new EntryResponse();
  }

  toggleContent() {
    this.entriesService.heightAuto.next(!this.heightAuto);
  }

  deleteEntry(id) {
    this.http.post(
        API_BASE + 'delete-entry',
        {entry_id: id},
        {headers: this.auth.authHeaders()}
    );
  }

  sendResponse(id: number, caller: string, taskId: string, dbTable: string, contentId: number) {
    if (this.response.decision !== '') {
      this.http.post(
          API_BASE + 'call',
          {entry_id: id, caller: caller, current_task: taskId, data: this.response, dbTable: dbTable, insertId: contentId},
          {headers: this.auth.authHeaders()}
      ).subscribe(res => this.updateStatus(id));
    }
  }

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

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.entriesService.entry.next([]);
    this.entriesService.entries.next([]);
  }

}
