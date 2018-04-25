import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataTablesService {

  tables: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  columns: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  tableName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  modalTableName: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
            this.tableName.next(table);
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
