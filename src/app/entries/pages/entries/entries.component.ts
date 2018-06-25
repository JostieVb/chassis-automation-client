import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit, OnDestroy {

  /**
   * showDetail       :   indicates if the selected entry's details should be displayed
   * subs             :   component subscriptions
   * */
  protected showDetail = false;
  private subs = [];

  constructor(
      private entriesService: EntriesService
  ) { }

  /**
   * On initialization, subscribe to the showDetail observable
   * */
  ngOnInit() {
    this.subs.push(
      this.entriesService.showDetail.subscribe(show => this.showDetail = show)
    );
  }

  /**
   * When the component get's destroyed, unsubscribe all component subscriptions
   *
   * */
  ngOnDestroy() {
    this.entriesService.entries.next([]);
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
