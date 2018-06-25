import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../components/services/alert.service';
import { FormsService } from '../../services/forms.service';
import { Alert } from '../../../components/alert/alert';
import { Router } from '@angular/router';
import {Form} from '../../models/form';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss']
})
export class NewFormComponent implements OnInit {

  protected name = '';
  protected identifier = '';
  protected creating = false;

  constructor(
    private alert: AlertService,
    private formsService: FormsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Generate form identifier
   *
   * */
  generateIdentifier() {
    if (this.name !== '') {
      const fullname = this.name.split(' ');
      let fullnamestr = '';
      fullname.forEach(seg => {
        fullnamestr += seg + '-';
      });
      this.identifier = 'form-' + fullnamestr.substr(0, fullnamestr.length - 1).toLowerCase();
    } else {
      this.identifier = '';
    }
  }

  /**
   * Create a new, empty form
   * */
  createForm() {
    if (this.name !== '' && this.identifier !== '') {
      this.creating = true;
      this.formsService.checkIfUniqueIdentifierExists(this.identifier).subscribe(res => {
        if (res) {
          const id = this.identifier;
          this.alert.alert.next(new Alert('A form with identifier \'' + id + '\' already exists.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
        } else {
          this.formsService.newForm(new Form(0, this.identifier, this.name, [])).subscribe(response => {
            if (response['status'] === 200 && response['id']) {
                this.dismissModal();
                this.alert.alert.next(new Alert('Form successfully created.', 'success', '', true, false));
                this.router.navigate(['/forms/' + response['id']]);
            } else {
              this.alert.alert.next(new Alert('Something went wrong.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
            }
          });
        }
        this.creating = false;
      });
    } else {
      this.alert.alert.next(new Alert('Please fill in all fields.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
    }
  }

  /**
   * Dismiss the modal
   * */
  dismissModal() {
    this.name = '';
    this.identifier = '';
    $('#closeNewFormModal').trigger('click');
  }

}
