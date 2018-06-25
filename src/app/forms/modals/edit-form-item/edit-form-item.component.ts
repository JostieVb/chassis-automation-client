import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { FormField } from '../../models/form-field';
import { Alert } from '../../../components/alert/alert';
import { AlertService } from '../../../components/services/alert.service';
import { FORM_BUILDER_ITEMS } from '../../form-builder-items';

@Component({
  selector: 'app-edit-form-item',
  templateUrl: './edit-form-item.component.html',
  styleUrls: ['./edit-form-item.component.scss']
})
export class EditFormItemComponent implements OnInit {

  protected editFormItem = false;
  protected field = new FormField('', '', '', '', false);
  protected editField = false;
  protected formBuilderItems = FORM_BUILDER_ITEMS;
  private subs = [];

  constructor(
      private formsService: FormsService,
      private alert: AlertService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.formsService.editFormItem.subscribe(bool => this.editFormItem = bool),
      this.formsService.field.subscribe(field => this.field = field),
      this.formsService.editField.subscribe(bool => this.editField = bool)
    );
  }

  /**
   * Save the data of the edited field
   *
   * @param   field - an object that holds the fields data
   * */
  saveFormField(field: any) {
    console.log(field);
    if (field.name === '') {
      this.alert.alert.next(new Alert('Please, fill in all required fields.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', false, true, false, 3000));
    } else {
      this.formsService.editedFieldData.next(field);
      this.dismissModal();
    }
  }

  dismissModal() {
    this.formsService.editFormItem.next(false);
  }

}
