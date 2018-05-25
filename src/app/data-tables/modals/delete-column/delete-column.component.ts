import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';
import { API_BASE } from '../../../global';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../auth/user.service';

@Component({
  selector: 'app-delete-column',
  templateUrl: './delete-column.component.html',
  styleUrls: ['./delete-column.component.scss']
})
export class DeleteColumnComponent implements OnInit, OnDestroy {

  /**
   * columnName     :   name of the selected column
   * */
  protected columnName = '';
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService,
      private http: HttpClient,
      private auth: UserService
  ) { }

  /**
   * On modal initialization, subscribe on the column name
   * */
  ngOnInit() {
    this.subs.push(
        this.dataTablesService.modalColumnName.subscribe(columnName => this.columnName = columnName)
    );
  }

  /**
   * Delete column
   *
   * @param column - name of the column
   * */
  deleteColumn(column: string) {
    const table = this.dataTablesService.tableName.getValue();
      this.http.post(
          API_BASE + 'data/delete-column',
          {table: table, column: column},
          {headers: this.auth.authHeaders()}
      ).subscribe(res => {
          this.dataTablesService.getTableColumns(table, true);
      });
  }

  /**
   * Dismiss the modal
   *
   * */
  dismissModal() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * When the modal get's destroyed, unsubscribe all subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
