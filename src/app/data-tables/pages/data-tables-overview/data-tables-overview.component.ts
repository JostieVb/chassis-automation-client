import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';

@Component({
  selector: 'app-data-tables-overview',
  templateUrl: './data-tables-overview.component.html',
  styleUrls: ['./data-tables-overview.component.scss']
})
export class DataTablesOverviewComponent implements OnInit, OnDestroy {

  protected selectedTable = '';
  protected tables = [];
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
    this.dataTablesService.columns.next([]);
    this.subs.push(
      this.dataTablesService.tables.subscribe(tables => this.tables = tables),
      this.dataTablesService.tableName.subscribe(tableName => this.selectedTable = tableName)
    );
    this.dataTablesService.getDbTables();
  }

  protected editTable(table) {
    if (this.dataTablesService.tableName.getValue() !== table) {
        this.dataTablesService.columns.next([]);
        this.dataTablesService.loading.next(true);
        this.dataTablesService.getTableColumns(table, true);
        this.dataTablesService.tableName.next(table);
        this.dataTablesService.showDataTable.next(true);
    }
  }

  protected deleteTable(table) {
    this.dataTablesService.modalTableName.next(table);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
