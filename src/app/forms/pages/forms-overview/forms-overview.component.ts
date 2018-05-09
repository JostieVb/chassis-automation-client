import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-forms-overview',
  templateUrl: './forms-overview.component.html',
  styleUrls: ['./forms-overview.component.scss']
})
export class FormsOverviewComponent implements OnInit {

  /**
   * forms    :   an array that holds all forms
   * */
  protected forms = [];

  constructor(
    private formsService: FormsService
  ) { }

  /**
   * Get all forms on component initialization
   *
   * */
  ngOnInit() {
    this.formsService.forms.subscribe(forms => this.forms = forms);
    this.formsService.getForms();
  }

  /**
   * Open the 'new form' form
   * */
  newForm() {
    this.formsService.title.next('New form');
    this.formsService.showForm.next(true);
  }

  /**
   * Edit the selected form
   *
   * @param   id - id of the selected form
   * */
  editForm(id: number) {
    this.formsService.loadForm(id);
    this.formsService.title.next('Edit form');
  }

}
