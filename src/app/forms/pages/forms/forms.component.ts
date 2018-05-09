import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService } from '../../../auth/confirmation.service';
import { FormsService } from '../../services/forms.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {

  protected showForm = false;
  private subs = [];

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

  ngOnInit() {
    this.formsService.showForm.subscribe(show => this.showForm = show);
  }

  /**
   * Unsubscribe all component subscription on destroy
   * */
  ngOnDestroy() {
    this.formsService.form.next([]);
    this.formsService.formId.next(0);
    this.formsService.showForm.next(false);

    this.subs.forEach(sub => sub.unsubscribe());
  }
}
