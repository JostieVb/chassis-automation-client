import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { API_BASE } from '../../../global';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../auth/user.service';
import { AlertService } from '../../../components/services/alert.service';
import { Alert } from '../../../components/alert/alert';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss']
})
export class DeleteFormComponent implements OnInit, OnDestroy {

  protected content = {};
  private subs = [];

  constructor(
      private formsService: FormsService,
      private http: HttpClient,
      private auth: UserService,
      private alert: AlertService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.formsService.deleteModalContent.subscribe(content => this.content = content)
    );
  }

  /**
   * Delete the form
   * */
  deleteForm(id: number) {
    this.http.get(
    API_BASE + 'forms/delete/' + id,
    {headers: this.auth.authHeaders()}
    ).subscribe(res => {
      if (res['status'] === 200) {
        this.formsService.getForms();
          this.alert.alert.next(new Alert(
          'Form successfully deleted.',
          'success'
          ));
      } else {
        this.alert.alert.next(new Alert(
        'Could not delete form due to an unkown reason.',
        'danger',
        '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>'
        ));
      }
      this.dismissModal();
    });
  }

  dismissModal() {
    this.formsService.deleteModalContent.next({});
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
