import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Form } from '../models/form';
import { FormField } from '../models/form-field';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FormsService {

  /**
   * forms        :       an array that holds all forms
   * form         :       an array that holds the metadata and structure of the currently loaded form
   * formId       :       the id of the currently loaded form
   * field        :       the data of the field that is currently being edited
   * fields       :       an object that holds all form fields
   * loadingForms :       indicates whether the forms are loading
   * */
  public forms: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public form: BehaviorSubject<Form> = new BehaviorSubject<Form>(new Form(0, '', '', []));
  public formId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public field: BehaviorSubject<any> = new BehaviorSubject<any>(new FormField('', '', '', '', false));
  public fields: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public editField: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public editedFieldData: BehaviorSubject<any> = new BehaviorSubject<any>(new FormField('', '', '', '', false));
  public loadingForms: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public loadingForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public editFormItem: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public deleteModalContent: BehaviorSubject<any> = new BehaviorSubject<any>({name: '', id: 0, identifier: ''});

  constructor(
    private http: HttpClient,
    private auth: UserService
  ) { }

  /**
   * A new form was created, save it in the database
   *
   * @param   form - the object that holds the form
   * @return  Observable<any>
   * */
  newForm(form: Form): Observable<any> {
    return this.http.post(
    API_BASE + 'forms/new-form',
    {form: form},
    {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Save an existing form
   *
   * @param   form - the object that holds the form
   * */
  saveForm(form: Form) {
    return this.http.post(
    API_BASE + 'forms/save-form',
    {form: form},
    {headers: this.auth.authHeaders()}
     );
  }

  /**
   * Get all forms
   *
   * */
  getForms() {
    this.loadingForms.next(true);
    this.http.get(API_BASE + 'forms/get-forms',
    {headers: this.auth.authHeaders()})
    .subscribe(
    forms => {
      this.forms.next(forms);
      this.loadingForms.next(false);
    });
  }

  /**
   * Get form fields in IOption format
   *
   * @param   identifier - id of the form which fields must be retrieved
   * */
  getFormFields(identifier: string): Observable<any> {
    return this.http.get(
    API_BASE + 'forms/get-form-fields/' + identifier,
    {headers: this.auth.authHeaders()}
    );
  }

  /**
   * Load a form
   *
   * @param   id - id of the form that will be loaded
   * */
  loadForm(id: number) {
    this.http.get(API_BASE + 'forms/get-form/' + id,
    {headers: this.auth.authHeaders()})
    .subscribe(
    form => {
      const formObj = form[0];
      console.log(formObj);
      this.form.next(new Form(formObj['id'], formObj['identifier'], formObj['name'], formObj['structure']));
      this.formId.next(id);
      this.loadingForm.next(false);
    });
  }

  /**
   * Check if the unique identifier of a new form already exists
   *
   * @param   id - the id that should be checked
   * */
  checkIfUniqueIdentifierExists(id: string) {
    return this.http.get(
    API_BASE + 'forms/check-unique-identifier/' + id,
    {headers: this.auth.authHeaders()}
    );
  }
}
