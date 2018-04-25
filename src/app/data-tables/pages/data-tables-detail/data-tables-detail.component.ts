import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataTablesService } from '../../services/data-tables.service';

@Component({
  selector: 'app-data-tables-detail',
  templateUrl: './data-tables-detail.component.html',
  styleUrls: ['./data-tables-detail.component.scss']
})
export class DataTablesDetailComponent implements OnInit, OnDestroy {

  protected columns = [];
  protected tableName = '';
  private subs = [];

  constructor(
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
    this.subs.push(
        this.dataTablesService.columns.subscribe(columns => this.columns = columns),
        this.dataTablesService.tableName.subscribe(tableName => this.tableName = tableName)
    );
  }

  dismissTable() {
    this.dataTablesService.tableName.next('');
    this.dataTablesService.columns.next([]);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
