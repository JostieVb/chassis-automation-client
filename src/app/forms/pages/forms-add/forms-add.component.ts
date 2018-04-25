import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { DataTablesService } from '../../../data-tables/services/data-tables.service';

@Component({
  selector: 'app-forms-add',
  templateUrl: './forms-add.component.html',
  styleUrls: ['./forms-add.component.scss']
})
export class FormsAddComponent implements OnInit, OnDestroy {

  protected structure = [];
  protected identifier = '';
  protected formName = '';
  protected fieldName = '';
  protected fieldLabel = '';
  protected fieldPlaceholder = '';
  protected fieldType = '';
  protected required = false;
  protected errorMsg = '';
  protected deleteOverlay = '';
  protected showFieldEditor = false;
  protected occupiedIds: any;
  protected editField = false;
  protected tables = [];
  protected columns = [];
  protected dbTable = '';
  protected dbColumn = '';
  protected editingForm = false;
  protected editingFieldName = '';
  protected formId = 0;
  private subs = [];

  constructor(
    private formsService: FormsService,
    private dataTablesService: DataTablesService
  ) { }

  ngOnInit() {
      this.subs.push(
          this.formsService.getFormIdentifiers().subscribe(ids => this.occupiedIds = ids),
          this.dataTablesService.tables.subscribe(tables => this.tables = tables),
          this.dataTablesService.columns.subscribe(columns => this.columns = columns),
          this.formsService.form.subscribe(form => this.loadForm(form)),
          this.formsService.formId.subscribe(id => this.formId = id)
      );
      this.dataTablesService.getDbTables();
  }

  addField() {
    if (this.validateField()) {
      this.pushField(this.fieldLabel, this.fieldPlaceholder, this.fieldType, this.dbColumn, this.required);
    }
  }

  saveField() {
    for (const item of this.structure) {
        if (item['fieldName'] === this.editingFieldName) {
            const index = this.structure.indexOf(item);
            if (this.validateField()) {
                this.columns.forEach(column => {
                    if (column['name'] === this.structure[index]['dbColumn']) {
                        column['taken'] = false;
                    }
                    if (column['name'] === this.dbColumn) {
                        column['taken'] = true;
                    }
                });
               this.structure[index]['fieldLabel'] = this.fieldLabel;
               this.structure[index]['fieldPlaceholder'] = this.fieldPlaceholder;
               this.structure[index]['fieldType'] = this.fieldType;
               this.structure[index]['dbColumn'] = this.dbColumn;
               this.structure[index]['required'] = this.required;
               this.dismissFields();
            }
        }
    }
  }

  validateField() {
      if (this.fieldType !== '' && this.fieldLabel !== '' && this.dbColumn !== '') {
          this.columns.forEach(column => {
              if (column['name'] === this.dbColumn) {
                  column['taken'] = true;
              }
          });
          return true;
      }
      this.errorMsg = 'Something went wrong.';
      return false;
  }

  pushField(fieldLabel: string, fieldPlaceholder: string, fieldType: string, dbColumn: string, required: boolean) {
    this.structure.push({
        'fieldName': this.generateFieldname(),
        'fieldLabel': fieldLabel,
        'fieldPlaceholder': fieldPlaceholder,
        'fieldType': fieldType,
        'dbColumn': dbColumn,
        'required': required
    });
    this.dismissFields();
  }

  generateFieldname() {
    const date = new Date();
    const components = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
    return 'ca_' + components.join('');
  }

  dismissFields() {
      this.fieldPlaceholder = '';
      this.fieldLabel = '';
      this.fieldType = '';
      this.required = false;
      this.showFieldEditor = false;
      this.errorMsg = '';
      this.dbColumn = '';
      this.editingFieldName = '';
      this.editField = false;
  }

  deleteFormItem(name: string, dbColumn: string) {
    this.columns.forEach(column => {
       if (column['name'] === dbColumn) {
           column['taken'] = false;
       }
    });

    this.structure.forEach((item, index) => {
      if (item.fieldName === name) {
        this.structure.splice(index, 1);
        this.deleteOverlay = '';
        this.dismissFields();
      }
    });
  }

  loadForm(formObj) {
      if (formObj.length === 1) {
          this.dismissFields();
          const form = formObj[0];
          this.formName = form['name'];
          this.dbTable = form['db_table'];
          this.identifier = form['identifier'];
          this.structure = JSON.parse(form['structure']);
          this.editingForm = true;
      }
  }

  postForm(action) {
    if (this.validateForm()) {
        this.formsService.postForm(this.formName, this.identifier, this.dbTable, this.structure, action, this.formId).subscribe(res => {
            if (res['status'] === 200) {
                this.dismissForm();
                this.formsService.getForms();
            } else {
                this.errorMsg = res['message'];
            }
        });
    }
  }

  validateForm() {
      if (this.formName !== '' && this.identifier !== '' && this.dbTable !== '' && this.structure.length > 0) {
          if (this.occupiedIds.indexOf(this.identifier.toLowerCase()) > -1) {
              this.errorMsg = 'Unique form identifier \'' + this.identifier + '\' already taken.';
              return false;
          } else {
              return true;
          }
      } else {
          this.errorMsg = 'Enter all required data to create a form.';
          return false;
      }
  }

  generateIdentifier() {
      if (this.editingForm === false) {
          if (this.formName !== '') {
              const fullname = this.formName.split(' ');
              let fullnamestr = '';
              fullname.forEach(seg => {
                  fullnamestr += seg + '-';
              });
              this.identifier = 'form-' + fullnamestr.substr(0, fullnamestr.length - 1).toLowerCase();
          } else {
              this.identifier = '';
          }
      }
  }

  editFormItem(name) {
      this.errorMsg = '';
      if (this.columns.length === 0) {
          this.dataTablesService.getTableColumns(this.dbTable);
      }
      for (const field of this.structure) {
        if (field['fieldName'] === name) {
            this.columns.forEach(column => {
                if (column['name'] === field['dbColumn']) {
                    column['taken'] = false;
                }
            });
            this.editingFieldName = name;
            this.editField = true;
            this.fieldLabel = field['fieldLabel'];
            this.fieldPlaceholder = field['fieldPlaceholder'];
            this.fieldType = field['fieldType'];
            this.required = field['required'];
            this.dbColumn = field['dbColumn'];
            this.showFieldEditor = true;
        }
      }
  }

  setColumnsStatus() {
      this.structure.forEach(field => {
          this.columns.forEach(column => {
            if (column['name'] === field['dbColumn']) {
                column['taken'] = true;
            } else {
                column['taken'] = false;
            }
          });
      });
  }

  dismissForm() {
      this.dismissFields();
      this.editingForm = false;
      this.formName = '';
      this.identifier = '';
      this.structure = [];
      this.dbTable = '';
  }

  getTableColumns() {
      this.dataTablesService.getTableColumns(this.dbTable);
  }

  toggleFieldEditor() {
      this.showFieldEditor = true;
      if (this.columns.length === 0) {
          this.dataTablesService.getTableColumns(this.dbTable);
      }
  }

  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
      this.formsService.formId.next(0);
      this.formsService.form.next([]);
      this.dismissFields();
  }

}
