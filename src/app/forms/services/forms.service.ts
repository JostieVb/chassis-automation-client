import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTablesService } from '../../data-tables/services/data-tables.service';

@Injectable()
export class FormsService {

    /**
     * forms        :       an array that holds all forms
     * form         :       an array that holds the metadata and structure of the currently loaded form
     * formId       :       the id of the currently loaded form
     * showForm     :       boolean that indicates whether a form is being edited or not
     * */
    public forms: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public form: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public formId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public showForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public title: BehaviorSubject<string> = new BehaviorSubject<string>('New form');

    constructor(
        private http: HttpClient,
        private auth: UserService,
        private dataTablesService: DataTablesService
    ) { }

    /**
     * Post form metadata and structure to the back-end
     *
     * @param   formName - the name of the form
     * @param   identifier - unique form identifier
     * @param   dbTable - the linked data table
     * @param   structure - an object that holds the form structure
     * @param   action - 'save' || 'add': whether a new form should be added or an existing form should be edited
     * @param   formId - the id (number) of the form
     * @return  observable<any>
     * */
    postForm(formName: string, identifier: string, dbTable: string, structure: any, action: string, formId: number) {
        return this.http.post(
            API_BASE + 'forms/form',
            {form_name: formName, identifier: identifier, db_table: dbTable, structure: structure, action: action, id: formId},
            {headers: this.auth.authHeaders()}
        );
    }

    /**
     * Get all forms
     *
     * */
    getForms() {
        this.http.get(API_BASE + 'forms/get-forms',
            {headers: this.auth.authHeaders()})
            .subscribe(
                forms => this.forms.next(forms)
            );
    }

    /**
     * Get all form identifiers
     *
     * */
    getFormIdentifiers() {
        return this.http.get(API_BASE + 'forms/get-form-ids',
            {headers: this.auth.authHeaders()});
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
                    this.dataTablesService.getTableColumns(form[0]['db_table']);
                    this.form.next(form);
                    this.formId.next(id);
                    this.showForm.next(true);
                }
            );
    }
}
