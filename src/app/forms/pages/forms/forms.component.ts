import { Component, OnDestroy } from '@angular/core';
import { ConfirmationService } from '../../../auth/confirmation.service';
import { FormsService } from '../../services/forms.service';
import { Form } from '../../models/form';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnDestroy {

  constructor(
    private confirmationService: ConfirmationService,
    private formsService: FormsService
  ) { }

  /**
   * If the user has unsaved data, prompt
   * the user before leaving the component
   *
   * */
  // canDeactivate(): Observable<boolean> | boolean {
  //   if (this.formsService.form.getValue().length > 0) {
  //        return this.confirmationService.confirm();
  //   }
  //   return true;
  // }

  /**
   * Unsubscribe all component subscription on destroy
   * */
  ngOnDestroy() {
    this.formsService.form.next(new Form(0, '', '', []));
    this.formsService.formId.next(0);
    this.formsService.forms.next([]);
  }
}
