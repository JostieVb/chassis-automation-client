import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlowLoadService } from '../../services/flowload.service';
import { EMPTY_XML } from '../../../global';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {

  /**
   * loadingPreview     :   indicates if the flowloaders is loading the preview
   * subs               :   component subscriptions
   * */
  protected loadingPreview = false;
  protected previewLoaded = false;
  private subs = [];

  constructor(private flowLoader: FlowLoadService) { }

  /**
   * On initialization, subscribe to the preview that was loaded by the flowLoader
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.flowLoader.loadingPreview.subscribe(loading => this.loadingPreview = loading),
      this.flowLoader.previewLoaded.subscribe(loaded => this.previewLoaded = loaded)
    );
  }

  /**
   * On destroy, unsubscribe all subscriptions
   *
   * */
  ngOnDestroy() {
    this.flowLoader.process.next(EMPTY_XML);
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
