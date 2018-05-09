import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-entries-overview',
  templateUrl: './entries-overview.component.html',
  styleUrls: ['./entries-overview.component.scss']
})
export class EntriesOverviewComponent implements OnInit, OnDestroy {
  /**
   * entries    :   all entries
   * subs       :   component subscriptions
   * */
  protected entries = [];
  protected selectedEntryId: number;
  protected selectedEntry = [];
  protected filter = 'all';
  private subs = [];

  constructor(
      private entriesService: EntriesService
  ) { }

  ngOnInit() {
    this.entriesService.getEntries();
    this.subs.push(
      this.entriesService.entries.subscribe(entries => this.entries = entries),
      this.entriesService.entry.subscribe(entry => this.selectedEntry = entry),
        this.entriesService.selectedEntryId.subscribe( selectedEntryId => this.selectedEntryId = selectedEntryId)
    );
  }

  showDetails(id) {
    if (this.selectedEntryId !== id) {
        this.entriesService.selectedEntryId.next(null);
        this.entriesService.heightAuto.next(false);
        this.entriesService.getEntry(id);
        this.entriesService.showDetail.next(true);
    }
  }

  setFilter(filter) {
    this.filter = filter;
    this.entriesService.getEntries(filter);
  }

  ngOnDestroy() {
    this.entriesService.selectedEntryId.next(null);
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
