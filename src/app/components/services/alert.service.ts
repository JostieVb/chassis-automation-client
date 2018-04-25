import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer } from '@angular/platform-browser';

declare var require;
const $ = require('jQuery');

@Injectable()
export class AlertService {
  public alert: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private sanitizer: DomSanitizer) { }

  buildAlert(alert) {
    const html = '<div class="alert alert-' + alert.color + ' alert-dismissible fade" role="alert">' + alert.text + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    this.alert.next(this.sanitizer.bypassSecurityTrustHtml(html));
  }

}
