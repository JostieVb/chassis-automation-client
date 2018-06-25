import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../global';
import { UserService } from '../../auth/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataTablesService {

  /**
   * tables             :       an array that holds all data tables with prefix 'ca_'
   * columns            :       an array that holds all columns of the selected data table with prefix 'ca_'
   * tableName          :       the selected data table name
   * modalTableName     :       the table name that should be displayed in the modal
   * modalColumnName    :       the column name that should be displayed in the modal
   * loading            :       indicates whether columns of a data table are loading
   * loadingTables      :       indicates whether the data tables are loading
   * showDataTable      :       indicates if the selected data table should be displayed
   * */
  public tables: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public columns: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public tableName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public modalTableName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public modalColumnName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingTables: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showDataTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * Get all data tables with prefix 'ca_'
   *
   * */
  getDbTables() {
    this.loadingTables.next(true);
    this.http.get(
        API_BASE + 'data/get-tables',
        {headers: this.auth.authHeaders()}
    ).subscribe(tables => {
      this.tables.next(tables);
      this.loadingTables.next(false);
    });
  }

  /**
   * Get data table columns with prefix 'ca_'
   *
   * @param     table - name of the table
   * @param     detailed - (optional) whether detailed information about the columns should be given
   * */
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

  /**
   * Add 'ca_' prefix to name
   *
   * @param     name - name of the table or column
   * @return    string - prefixed name
   * */
  addPrefix(name: string) {
    let prefixedName = '';
    if (name.substr(0, 3) !== 'ca_') {
        prefixedName = 'ca_' + name;
    }
    return prefixedName.replace(/ /g , '_').toLowerCase();
  }
}
