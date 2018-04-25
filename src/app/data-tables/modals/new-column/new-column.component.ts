import { Component, OnInit } from '@angular/core';
import { IOption } from 'ng-select';
import { types } from '../../types';
import { Column } from '../../models/column';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';
import { UserService } from '../../../auth/user.service';
import { DataTablesService } from '../../services/data-tables.service';

@Component({
  selector: 'app-new-column',
  templateUrl: './new-column.component.html',
  styleUrls: ['./new-column.component.scss']
})
export class NewColumnComponent implements OnInit {

  protected types: Array<IOption> = types;
  protected column: Column = new Column();
  protected errorMsg = '';
  protected errorMsgClass = 'alert-danger';

  constructor(
      private http: HttpClient,
      private auth: UserService,
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
  }

  addColumn() {
    if (this.column.name !== '' && this.column.type !== '') {
      const table = this.dataTablesService.tableName.getValue();
      this.column.name = this.dataTablesService.addPrefix(this.column.name);
      this.http.post(
          API_BASE + 'data/add-column',
          {table: table, column: this.column},
          {headers: this.auth.authHeaders()}
      ).subscribe(res => {
        if (res['status'] === 200) {
          this.dataTablesService.getTableColumns(table, true);
          this.errorMsgClass = 'alert-success';
        } else {
          this.errorMsgClass = 'alert-danger';
        }
        this.errorMsgClass = res['message'];
      });
    } else {
      this.errorMsg = 'Fill in all required fields.';
      this.errorMsgClass = 'alert-danger';
    }
  }

  dismissModal() {
    this.column = new Column();
    this.errorMsg = '';
    this.errorMsgClass = 'alert-danger';
  }

}
