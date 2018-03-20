import { Component, OnInit } from '@angular/core';
import { EntriesService } from '../../services/entries.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  /**
   * subs   :   component subscriptions
   * */
  private subs = [];

  constructor(private entriesService: EntriesService) { }

  ngOnInit() {
    this.subs.push(

    );
  }

}
