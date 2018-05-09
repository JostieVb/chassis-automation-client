import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from '../../auth/user.service';
import { Entry } from '../models/entry';
import { EntryResponse } from '../models/entry-response';

@Injectable()
export class EntriesService {

    /**
     * entries          :   all entries
     * entry            :   selected entry
     * loading          :   whether an entry is loading
     * selectedEntryId  :   the id of the selected entry
     * heightAuto       :   whether the entry table should be collapsed
     * unreadEntries    :   the amount of unread entries
     * response         :   bound to the response message input field
     * */
    public entries: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public entry: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public selectedEntryId: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public heightAuto: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public unreadEntries: BehaviorSubject<any> = new BehaviorSubject(0);
    public response: BehaviorSubject<EntryResponse> = new BehaviorSubject<EntryResponse>(new EntryResponse());
    public showDetail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private auth: UserService
    ) { }

    /**
     * Get the entries based on authenticated user
     *
     * @param   filter - optional filters
     * */
    public getEntries(filter?: string) {
      if (filter) {
        this.http.get(API_BASE + 'entries/filter/' + filter, {
            headers: this.auth.authHeaders()
        }).subscribe(entries => this.entries.next(entries));
      } else {
        this.http.get(API_BASE + 'entries', {
            headers: this.auth.authHeaders()
        }).subscribe(entries => this.entries.next(entries));
      }
    }

    /**
     * Get and format a single entry
     *
     * @param   id - id of the entry
     * */
    public getEntry(id: number) {
        this.response.next(new EntryResponse());
        this.loading.next(true);
        this.http.get(API_BASE + 'entries/' + id, {
            headers: this.auth.authHeaders()
        }).subscribe(entry => {
            const formattedEntry = new Entry();
            formattedEntry.id = entry['id'];
            formattedEntry.responseMessage = entry['response_message'];
            formattedEntry.dbTable = entry['db_table'];
            formattedEntry.contentId = entry['content_id'];
            formattedEntry.title = entry['title'];
            formattedEntry.date = entry['date'];
            formattedEntry.label = entry['label'];
            formattedEntry.caller = entry['caller'];
            formattedEntry.status = entry['status'];
            formattedEntry.sender = entry['sender'];
            formattedEntry.task = entry['task_id'];
            formattedEntry.message = entry['message'];
            formattedEntry.decisions = entry['decisions'];
            formattedEntry.content = entry['content'];
            this.selectedEntryId.next(entry['id']);
            this.entry.next(formattedEntry);
            this.loading.next(false);
            for (const entr of this.entries.getValue()) {
                if (entr['id'] === id && entr['unread'] === 'true') {
                    this.setUnreadFalse(id);
                }
            }
        });
    }

    /**
     * Count the unread entries from the authenticated user
     *
     * */
    public countUnreadEntries() {
        this.http.get(
            API_BASE + 'count-unread-entries',
            {headers: this.auth.authHeaders()}
        ).subscribe(unreadEntries => this.unreadEntries.next(unreadEntries));
    }

    /**
     * Set the unread status to false
     *
     * @param   id - id of the entry
     * */
    private setUnreadFalse(id) {
        this.http.get(
            API_BASE + 'set-unread-false/' + id,
            {headers: this.auth.authHeaders()}
        ).subscribe(res => {
            this.countUnreadEntries();
            const entries = this.entries.getValue();
            for (const entry of entries) {
                if (entry['id'] === id) {
                    entry['unread'] = 'false';
                }
            }
            this.entries.next(entries);
        });
    }
}
