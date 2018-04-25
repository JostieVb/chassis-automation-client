import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  subs = [];
  protected alert: any;
  protected showAlertBox = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subs.push(
        this.alertService.alert.subscribe((alert) => {
          this.alert = alert;
        })
    );
  }

  alertChanged() {
    this.showAlertBox = true;
    setTimeout(() => {
      this.showAlertBox = false;
    }, 2000);
  }

}
