import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';

@Component({
  selector: 'app-data-tables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.scss']
})
export class DataTablesComponent implements OnInit, OnDestroy {

  protected showDataTable = false;
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
    this.subs.push(
        this.dataTablesService.showDataTable.subscribe(show => this.showDataTable = show)
    );
  }

  ngOnDestroy() {
    this.dataTablesService.tables.next([]);
    this.dataTablesService.columns.next([]);
    this.dataTablesService.tableName.next('');
    this.dataTablesService.modalTableName.next('');

    this.subs.forEach(sub => sub.unsubscribe());
  }

}
