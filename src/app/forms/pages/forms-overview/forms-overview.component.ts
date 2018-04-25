import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-forms-overview',
  templateUrl: './forms-overview.component.html',
  styleUrls: ['./forms-overview.component.scss']
})
export class FormsOverviewComponent implements OnInit {

  protected forms = [];

  constructor(
    private formsService: FormsService
  ) { }

  ngOnInit() {
    this.formsService.forms.subscribe(forms => this.forms = forms);
    this.formsService.getForms();
  }

  editForm(id) {
    this.formsService.loadForm(id);
  }

}
