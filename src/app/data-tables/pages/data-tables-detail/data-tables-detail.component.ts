import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';

@Component({
  selector: 'app-data-tables-detail',
  templateUrl: './data-tables-detail.component.html',
  styleUrls: ['./data-tables-detail.component.scss']
})
export class DataTablesDetailComponent implements OnInit, OnDestroy {

  /**
   * columns        :   all columns of the selected data table
   * tableName      :   name of selected data table
   * loading        :   indicates of the columns are loading
   * subs           :   component subscriptions
   * */
  protected columns = [];
  protected tableName = '';
  protected loading = false;
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
    this.subs.push(
        this.dataTablesService.columns.subscribe(columns => this.columns = columns),
        this.dataTablesService.tableName.subscribe(tableName => this.tableName = tableName),
        this.dataTablesService.loading.subscribe(loading => this.loading = loading)
    );
  }

  /**
   * Close the data table
   *
   * */
  dismissTable() {
    this.dataTablesService.tableName.next('');
    this.dataTablesService.columns.next([]);
    this.dataTablesService.showDataTable.next(false);
  }

  /**
   * Ask the user for confirmation to delete
   * the data table column
   *
   * @param   column - the name of the column
   * */
  deleteColumn(column: string) {
    this.dataTablesService.modalColumnName.next(column);
  }

  /**
   * When the component get's destroyed,
   * unsubscribe all component subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
