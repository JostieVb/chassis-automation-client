import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../../global';
import { UserService } from '../../../auth/user.service';
import { DataTablesService } from '../../services/data-tables.service';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.scss']
})
export class NewTableComponent implements OnInit {

  /**
   * tableName      :     name of the table
   * errorMsg       :     the error message
   * errorMsgClass  :     CSS class for the error message
   * succes         :     indicates if a new table was succesfully added
   * */
  protected tableName = '';
  protected errorMsg = '';
  protected errorMsgClass = '';
  protected success = false;

  constructor(
      private http: HttpClient,
      private auth: UserService,
      private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
  }

  /**
   * Create the data table
   *
   * */
  protected createDataTable() {
    this.tableName = this.dataTablesService.addPrefix(this.tableName);
    this.http.post(
        API_BASE + 'data/create-data-table',
        {'table_name': this.tableName},
        {headers: this.auth.authHeaders()}
    ).subscribe(res => {
      this.dataTablesService.getDbTables();
      if (res['status'] === 200) {
        this.errorMsgClass = 'alert-success';
        this.success = true;
      } else {
        this.errorMsgClass = 'alert-danger';
        this.success = false;
      }
      this.errorMsg = res['message'];
    });
  }

  /**
   * Dismiss the modal
   *
   * */
  protected dismissModal() {
    $('.close').trigger('click');
    this.tableName = '';
    this.errorMsgClass = '';
    this.errorMsg = '';
    this.success = false;
  }

}
