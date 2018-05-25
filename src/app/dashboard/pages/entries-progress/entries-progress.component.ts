import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-entries-progress',
  templateUrl: './entries-progress.component.html',
  styleUrls: ['./entries-progress.component.scss']
})

export class EntriesProgressComponent implements OnInit, OnDestroy {

  /**
   * entriesNumbers     :   number of unread entries
   * subs               :   component subscriptions
   * */
  public entriesNumbers: any = {};
  private  subs = [];

  constructor(
    private dashboardService: DashboardService
  ) { }

  /**
   * On initialization, get the number of unread entries
   *
   * */
  ngOnInit() {
    this.dashboardService.getEntriesNumbersByStatus();
      this.subs.push(
          this.dashboardService.entriesNumbers.subscribe((entriesNumbers) => {
              this.entriesNumbers = entriesNumbers;
          })
      );
  }

  /**
   * On destroy, unsubscribe all subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
