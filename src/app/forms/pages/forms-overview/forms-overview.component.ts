import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-forms-overview',
  templateUrl: './forms-overview.component.html',
  styleUrls: ['./forms-overview.component.scss']
})
export class FormsOverviewComponent implements OnInit, OnDestroy {

  /**
   * forms        :   an array that holds all forms
   * loadingForms :   indicates whether the forms are loading
   * */
  protected forms = [];
  protected loadingForms = true;
  private subs = [];

  constructor(
    private formsService: FormsService
  ) { }

  /**
   * Get all forms on component initialization
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.formsService.forms.subscribe(forms => this.forms = forms),
      this.formsService.loadingForms.subscribe(value => this.loadingForms = value)
    );
    this.formsService.getForms();
  }

  /**
   * Delete the form
   *
   * @param id - id of the form
   * @param name - name of the form
   * @param identifier - the identifier of the form
   * */
  deleteForm(id: number, name: string, identifier: string) {
    this.formsService.deleteModalContent.next({id: id, name: name, identifier: identifier});
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.formsService.forms.next([]);
  }

}
