import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {
  entries: BehaviorSubject<any> = new BehaviorSubject<any>({});
  entriesNumbers: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) { }

  getEntriesNumbersByStatus() {
    this.http.get(API_BASE + 'get-entries-numbers-by-status').map(res => this.entriesNumbers.next(res));
  }

  getEntriesByStatus(column?: string) {
    if (column) {
      this.http.get(API_BASE + 'get-entries-by-status/' + column).subscribe(entries => this.entries.next(entries));
    } else {
      this.http.get(API_BASE + 'get-entries-by-status').subscribe(entries => this.entries.next(entries));
    }
  }
}
