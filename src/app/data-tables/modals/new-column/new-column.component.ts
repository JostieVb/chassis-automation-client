import { Component, OnInit } from '@angular/core';
import { IOption } from 'ng-select';
import { types } from '../../types';
import { Column } from '../../models/column';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';
import { UserService } from '../../../auth/user.service';
import { DataTablesService } from '../../services/data-tables.service';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-new-column',
  templateUrl: './new-column.component.html',
  styleUrls: ['./new-column.component.scss']
})
export class NewColumnComponent implements OnInit {

  /**
   * types      :     an array of types that can be chosen from
   * column     :     a model that holds properties of the new column
   * loading    :     indicates if the modal is loading
   * */
  protected types: Array<IOption> = types;
  protected column: Column = new Column();
  protected loading = false;

  constructor(
      private http: HttpClient,
      private auth: UserService,
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
  }

  /**
   * Add a column to the data table
   *
   * */
  addColumn() {
    if (this.column.name !== '' && this.column.type !== '') {
      const table = this.dataTablesService.tableName.getValue();
      const name = this.dataTablesService.addPrefix(this.column.name);
      this.loading = true;
      this.http.post(
          API_BASE + 'data/add-column',
          {table: table, column: {name: name, type: this.column.type}},
          {headers: this.auth.authHeaders()}
      ).subscribe(res => {
        if (res['status'] === 200) {
            this.dismissModal();
            this.dataTablesService.getTableColumns(table, true);
            $('.close').trigger('click');
        } else {
          console.log(res);
        }
        this.loading = false;
      });
    }
  }

  /**
   * Dismiss the modal
   *
   * */
  dismissModal() {
    this.column = new Column();
    this.loading = false;
  }

}
