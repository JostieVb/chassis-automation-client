import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-entries-overview',
  templateUrl: './entries-overview.component.html',
  styleUrls: ['./entries-overview.component.scss']
})
export class EntriesOverviewComponent implements OnInit, OnDestroy {
  /**
   * entries            :   an array that holds all entries
   * selectedEntryId    :   the id of the selected entry
   * selectedEntry      :   an array that holds the selected entry's data
   * filter             :   the
   * subs               :   component subscriptions
   * */
  protected entries = [];
  protected selectedEntryId: number;
  protected selectedEntry = [];
  protected filter = 'all';
  private subs = [];

  constructor(
      private entriesService: EntriesService
  ) { }

  /**
   * On initialization, get entries from the entriesService
   * and subscribe to required data from the entriesService
   *
   * */
  ngOnInit() {
    this.entriesService.getEntries();
    this.subs.push(
      this.entriesService.entries.subscribe(entries => this.entries = entries),
      this.entriesService.entry.subscribe(entry => this.selectedEntry = entry),
        this.entriesService.selectedEntryId.subscribe( selectedEntryId => this.selectedEntryId = selectedEntryId)
    );
  }

  /**
   * Show entry details
   *
   * @param   id - id of the entry
   * */
  showDetails(id: number) {
    if (this.selectedEntryId !== id) {
        this.entriesService.selectedEntryId.next(null);
        this.entriesService.heightAuto.next(false);
        this.entriesService.getEntry(id);
        this.entriesService.showDetail.next(true);
    }
  }

  /**
   * Set the filter and get entries by filter
   *
   * @param   filter - the filter where the entries should be filtered
   * */
  setFilter(filter: string) {
    this.filter = filter;
    this.entriesService.getEntries(filter);
  }

  /**
   * On destroy, unsubscribe component subscriptions and set
   * selected entry to null
   *
   * */
  ngOnDestroy() {
    this.entriesService.selectedEntryId.next(null);
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
