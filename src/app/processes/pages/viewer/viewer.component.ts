import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlowLoadService } from '../../services/flowload.service';
import { EMPTY_XML } from '../../../global';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  private subs = [];
  protected process = '';

  constructor(private flowLoader: FlowLoadService) { }

  ngOnInit() {
    this.subs.push(
      this.flowLoader.process.subscribe(res => this.process = res)
    );
  }

  ngOnDestroy() {
    this.flowLoader.process.next(EMPTY_XML);
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
