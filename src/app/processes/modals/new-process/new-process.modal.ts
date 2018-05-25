import { Component, OnInit } from '@angular/core';
import { ProcessService } from '../../services/process.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-process',
  templateUrl: './new-process.modal.html',
  styleUrls: ['./new-process.modal.scss']
})
export class NewProcessModalComponent implements OnInit {
  /**
   * nameField        :   bound to the name input field
   * codeField        :   bound to the code input field
   * codeChanged      :   indicates whether the process code was changed by the user
   * */
  protected nameField = '';
  protected codeField = '';
  protected codeChanged = false;

  constructor(
      private processService: ProcessService,
      private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Create new process
   *
   * */
  newProcess() {
    if (this.nameField !== '' && this.codeField !== '') {
      this.processService.processName.next(this.nameField);
      this.processService.processCode.next(this.codeField);
      this.dismissModal();
      this.router.navigateByUrl('/processes/new');
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
    this.nameField = '';
    this.codeField = '';
    this.codeChanged = false;
  }

}
