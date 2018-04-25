import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';
import { UserService } from '../../../auth/user.service';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';

@Component({
  selector: 'app-delete-data-table',
  templateUrl: './delete-data-table.component.html',
  styleUrls: ['./delete-data-table.component.scss']
})
export class DeleteDataTableComponent implements OnInit, OnDestroy {

  /**
   * tableName      :       name of table that will be prompted for deletion
   * subs           :       all component subscriptions
   * */

  protected tableName = '';
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService,
      private http: HttpClient,
      private auth: UserService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.dataTablesService.modalTableName.subscribe(tableName => this.tableName = tableName)
    );
  }

  /**
   * Delete data table
   *
   * table    :     string
   * */
  deleteDataTable(table) {
    this.http.get(
        API_BASE + 'data/delete/' + table,
        {headers: this.auth.authHeaders()}
    ).subscribe(res => {
      if (this.dataTablesService.tableName.getValue() === table) {
        this.dataTablesService.tableName.next('');
        this.dataTablesService.columns.next([]);
      }
      this.dataTablesService.getDbTables();
      this.dismissModal();
    });
  }

  /**
   * Dismiss modal and reset modal content
   *
   * */
  dismissModal() {
    this.dataTablesService.modalTableName.next('');
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
