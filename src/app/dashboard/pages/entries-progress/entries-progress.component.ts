import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-entries-progress',
  templateUrl: './entries-progress.component.html',
  styleUrls: ['./entries-progress.component.scss']
})

export class EntriesProgressComponent implements OnInit, OnDestroy {
  subs = [];
  entriesNumbers: any = {};

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getEntriesNumbersByStatus();
      this.subs.push(
          this.dashboardService.entriesNumbers.subscribe((entriesNumbers) => {
              this.entriesNumbers = entriesNumbers;
          })
      );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
