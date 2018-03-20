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
  private subs = [];

  constructor(private entriesService: EntriesService) { }

  ngOnInit() {
    this.subs.push(
        this.entriesService.entries.subscribe(entries => this.entries = entries)
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
