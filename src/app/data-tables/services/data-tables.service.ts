import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataTablesService {

  public tables: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public columns: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public tableName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public modalTableName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public modalColumnName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showDataTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

    getDbTables() {
        this.http.get(
            API_BASE + 'data/get-tables',
            {headers: this.auth.authHeaders()}
        ).subscribe(tables => this.tables.next(tables));
    }

    getTableColumns(table: string, detailed?: boolean) {
        let url = 'data/get-columns/';
        if (detailed) {
            url = 'data/get-detailed-columns/';
        }
        this.http.get(
            API_BASE + url + table,
            {headers: this.auth.authHeaders()}
        ).subscribe(columns => {
            this.columns.next(columns);
            this.loading.next(false);
        });
    }

    addPrefix(name: string) {
      let prefixedName = '';
        if (name.substr(0, 3) !== 'ca_') {
            prefixedName = 'ca_' + name;
        }
        return prefixedName.replace(/ /g , '_').toLowerCase();
    }
}
