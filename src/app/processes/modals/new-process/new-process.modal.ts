import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProcessService } from '../../services/process.service';
import { Router } from '@angular/router';
import { Alert } from '../../../components/alert/alert';
import { AlertService } from '../../../components/services/alert.service';
import { IOption } from 'ng-select';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-new-process',
  templateUrl: './new-process.modal.html',
  styleUrls: ['./new-process.modal.scss']
})
export class NewProcessModalComponent implements OnInit, OnDestroy {
  /**
   * nameField        :   bound to the name input field
   * codeField        :   bound to the code input field
   * callerField      :   bound to the caller input field
   * codeChanged      :   indicates whether the process code was changed by the user
   * forms            :   all forms that are created with the form builder
   * subs             :   modal subscriptions
   * */
  protected nameField = '';
  protected codeField = '';
  protected callerField = '';
  protected codeChanged = false;
  public forms: Array<IOption> = [];
  private subs = [];

  constructor(
      private processService: ProcessService,
      private router: Router,
      private alert: AlertService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.processService.getForms().subscribe(forms => this.forms = forms)
    );
  }

  /**
   * Create new process
   *
   * */
  newProcess() {
    if (this.nameField !== '' && this.codeField !== '' && this.callerField !== '') {
      this.processService.processName.next(this.nameField);
      this.processService.processCode.next(this.codeField);
      this.processService.processCaller.next(this.callerField);
      this.processService.checkUniqueProcessCodeExists(this.codeField).subscribe(res => {
          if (res) {
            // Process code already exists
            const id = this.codeField;
            this.alert.alert.next(new Alert('A process with process code \'' + id + '\' already exists.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
          } else {
            this.dismissModal();
            this.router.navigateByUrl('/processes/new');
            this.alert.alert.next(new Alert('Process successfully created.', 'success', '', true, false));
            setTimeout(() => {
              this.alert.alert.next(new Alert('The process is created, but it isn\'t saved yet. To save the process, click the \'Save\' button in the action menu.', 'info', '<i class="fa fa-info-circle" aria-hidden="true"></i>', false, true, true, 10000));
            }, 1000);
          }
      });
    } else {
      this.alert.alert.next(new Alert('Please enter values for all fields.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true));
    }
  }

  /**
   * Generate process code
   *
   * */
  generateProcessCode() {
    if (this.nameField === '') {
      this.codeField = '';
      this.codeChanged = false;
    }
    if (!this.codeChanged) {
      const fullname = this.nameField.split(' ');
      let fullnamestr = '';
      fullname.forEach(seg => {
        seg = seg.toUpperCase().substr(0, 4);
        fullnamestr += seg + '_';
      });
      this.codeField = fullnamestr.substr(0, fullnamestr.length - 1);
    }
  }

  /**
   * When code is changed by the user, set this in codeChanged
   *
   * */
  setCodeChanged() {
    if (this.codeField !== '') {
        this.codeChanged = true;
    }
  }

  /**
   * Formate the process code
   *
   * */
  formatProcessCode() {
    this.codeField = this.codeField.replace('-', '_');
  }

  /**
   * Dismiss the modal
   *
   * */
  dismissModal() {
    $('#closeNewProcessModal').trigger('click');
    this.nameField = '';
    this.codeField = '';
    this.callerField = '';
    this.codeChanged = false;
  }

  /**
   * When the modal gets destroyed, unsubscribe to all subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
