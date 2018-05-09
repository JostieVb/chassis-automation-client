import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit, OnDestroy {

  protected showDetail = false;
  private subs = [];

  constructor(
      private entriesService: EntriesService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.entriesService.showDetail.subscribe(show => this.showDetail = show)
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
