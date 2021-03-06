import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';
import { UserService } from '../../../auth/user.service';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';
import { Alert } from '../../../components/alert/alert';
import { AlertService } from '../../../components/services/alert.service';

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
      private auth: UserService,
      private alert: AlertService
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
        API_BASE + 'data/delete-table/' + table,
        {headers: this.auth.authHeaders()}
    ).subscribe(res => {
      if (this.dataTablesService.tableName.getValue() === table) {
        this.dataTablesService.tableName.next('');
        this.dataTablesService.columns.next([]);
      }
      this.dataTablesService.getDbTables();
      this.dismissModal();
      this.alert.alert.next(new Alert('Data tables successfully deleted.', 'success', '', true, false));
    });
  }

  /**
   * Dismiss modal and reset modal content
   *
   * */
  dismissModal() {
    this.dataTablesService.modalTableName.next('');
  }

  /**
   * When the modal get's destroyed, unsubscribe all subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
