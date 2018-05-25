import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  /**
   * showAlertbox   :     indicates if the alertbox is showing or not
   * keys           :     an array that holds all the id's of the alerts that are currently showing
   * alerts         :     an object that holds all the alerts that are currently showing
   * minInterval    :     the minimal interval that an alert should have if it has a fixed time span
   * subs           :     component subscriptions
   * */
  protected showAlertBox = false;
  protected keys = [];
  protected alerts = {};
  private minInterval = 1000;
  private subs = [];

  constructor(
    private alertService: AlertService
  ) { }

  /**
   * On component initializatoin, subscribe to the alert object
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.alertService.alert.subscribe((alert) => {
        if ('message' in alert && 'type' in alert && alert['message'] !== '' && alert['type'] !== '') {
          this.showAlert(alert);
          this.keys = Object.keys(this.alerts);
        }
      })
    );
  }

  /**
   * Show the alert when the message has changed
   *
   * @param   alert - an instance of an alert
   * */
  showAlert(alert) {
    const uniqueId = this.generateAlertId();
    this.showAlertBox = true;
    let prefix = '';
    let interval = 5000;
    let dismissable = true;
    let timer = null;

    if ('clearAlertBox' in alert && alert['clearAlertBox'] === true) {
      this.alerts = {};
      this.keys = [];
    }

    if ('prefix' in alert && alert['prefix'] !== '' && alert['prefix'] !== undefined && alert['prefix'] !== null) {
      prefix = alert['prefix'];
    }

    if ('interval' in alert && alert['interval'] !== '' && alert['interval'] !== undefined && alert['interval'] !== null) {
      if (alert['interval'] !== 0 && alert['interval'] < this.minInterval) {
        interval = this.minInterval;
      } else {
        interval = alert['interval'];
      }
    }

    if ('interval' in alert && alert['interval'] !== 0) {
      timer = setTimeout(() => {
        this.hideAlert(uniqueId);
      }, interval);
    }

    if ('dismissable' in alert && alert['dismissable'] === false) {
      dismissable = false;
    }

    this.alerts[uniqueId] = {
      message: alert.message,
      type: alert.type,
      fadeIn: setTimeout(() => {
        document.getElementById(uniqueId).classList.add('show');
      }),
      timer: timer,
      prefix: prefix,
      dismissable: dismissable
    };
  }

  /**
   * Hide an alert when clicked on close button or a timer ran out
   *
   * @param   id - the id of the alert
   * */
  hideAlert(id) {
    if (document.getElementById(id)) {
        if (this.alerts[id]['timer'] !== null) {
            clearTimeout(this.alerts[id]['timer']);
        }
        delete this.alerts[id];
        this.keys = Object.keys(this.alerts);
        if (Object.keys(this.alerts).length === 0) {
            this.showAlertBox = false;
        }
    }
  }

  /**
   * Generate a unique id for an alert
   *
   * @return    unique id as string
   * */
  generateAlertId() {
      const date = new Date();
      const components = [
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
      ];
      return components.join('');
  }

  /**
   * On destroy, unsubscribe all component subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
