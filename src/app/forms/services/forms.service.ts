import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataTablesService } from '../../data-tables/services/data-tables.service';

@Injectable()
export class FormsService {

    public forms: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public form: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public formId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
        private http: HttpClient,
        private auth: UserService,
        private dataTablesService: DataTablesService
    ) { }

    postForm(formName: string, identifier: string, dbTable: string, structure: any, action: string, formId: number) {
        return this.http.post(
            API_BASE + 'forms/form',
            {form_name: formName, identifier: identifier, db_table: dbTable, structure: structure, action: action, id: formId},
            {headers: this.auth.authHeaders()}
        );
    }

    getForms() {
        this.http.get(API_BASE + 'forms/get-forms',
            {headers: this.auth.authHeaders()})
            .subscribe(
                forms => this.forms.next(forms)
            );
    }

    getFormIdentifiers() {
        return this.http.get(API_BASE + 'forms/get-form-ids',
            {headers: this.auth.authHeaders()});
    }

    loadForm(id: number) {
        this.http.get(API_BASE + 'forms/get-form/' + id,
            {headers: this.auth.authHeaders()})
            .subscribe(
                form => {
                    this.dataTablesService.getTableColumns(form[0]['db_table']);
                    this.form.next(form);
                    this.formId.next(id);
                }
            );
    }
}
