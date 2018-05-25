import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';

@Component({
  selector: 'app-data-tables-overview',
  templateUrl: './data-tables-overview.component.html',
  styleUrls: ['./data-tables-overview.component.scss']
})
export class DataTablesOverviewComponent implements OnInit, OnDestroy {

  /**
   * selectedTable        :     name of the selected data table
   * tables               :     an array that holds all data tables
   * subs                 :     components subscriptions
   * */
  protected selectedTable = '';
  protected tables = [];
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService
  ) { }

  /**
   * On initialization, subscribe to the tables and tableName and
   * get de data tables from the service
   *
   * */
  ngOnInit() {
    this.dataTablesService.columns.next([]);
    this.subs.push(
      this.dataTablesService.tables.subscribe(tables => this.tables = tables),
      this.dataTablesService.tableName.subscribe(tableName => this.selectedTable = tableName)
    );
    this.dataTablesService.getDbTables();
  }

  /**
   * Load data table for editing
   *
   * @param   table - table name
   * */
  protected editTable(table) {
    if (this.dataTablesService.tableName.getValue() !== table) {
        this.dataTablesService.columns.next([]);
        this.dataTablesService.loading.next(true);
        this.dataTablesService.getTableColumns(table, true);
        this.dataTablesService.tableName.next(table);
        this.dataTablesService.showDataTable.next(true);
    }
  }

  /**
   * Delete data table
   *
   * @param   table - table name
   * */
  protected deleteTable(table) {
    this.dataTablesService.modalTableName.next(table);
  }

  /**
   * On destroy, unsubscribe all subscriptions
   *
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
