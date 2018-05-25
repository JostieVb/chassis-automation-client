import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { DataTablesService } from '../../../data-tables/services/data-tables.service';
import { Alert } from '../../../components/alert/alert';
import { AlertService } from '../../../components/services/alert.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit, OnDestroy {

  /**
   * title              :       the title that should be displayed above the form builder
   * structure          :       an array of objects that holds the form structure
   * identifier         :       the form identifier (string)
   * formName           :       the name of the form
   * fieldName          :       the name of the field
   * fieldLabel         :       the label of the field
   * fieldPlaceholder   :       the placeholder of the field
   * fieldType          :       the type of the field
   * required           :       boolean whether the field is required or not
   * errorMsg           :       an message that will be displayed when an error occurs
   * deleteOverlay      :       a string that holds the name of the field where the delete overlay should be displyed on hover
   * showFieldEditor    :       boolean for displaying the field editor
   * occupiedIds        :       an object that holds all of the existing form identifiers
   * editField          :       boolean that tells whether a field is being edited
   * tables             :       an array of all data tables with pre-fix 'ca_'
   * columns            :       an array of the select data table's columns with pre-fix 'ca_'
   * dbTable            :       the selected data table
   * dbColumn           :       the selected database column
   * editingForm        :       boolean that tells whether a form is being edited
   * editingFieldName   :       boolean that tells whether the fieldname is being edited
   * formId             :       the current form id (number)
   * subs               :       component subscriptions
   * */
  protected title = 'New form';
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
    private dataTablesService: DataTablesService,
    private alert: AlertService
  ) { }

  /**
   * On componet initialization, get all form identifiers, data tables,
   * column from selected data table and the current form and the form id
   *
   * */
  ngOnInit() {
      this.subs.push(
          this.formsService.getFormIdentifiers().subscribe(ids => this.occupiedIds = ids),
          this.dataTablesService.tables.subscribe(tables => this.tables = tables),
          this.dataTablesService.columns.subscribe(columns => this.columns = columns),
          this.formsService.form.subscribe(form => this.loadForm(form)),
          this.formsService.formId.subscribe(id => this.formId = id),
          this.formsService.title.subscribe(title => this.title = title)
      );
      this.dataTablesService.getDbTables();
  }

  /**
   * When a field is valid, push it to the form structure
   *
   * */
  addField() {
    if (this.validateField()) {
      this.pushField(this.fieldLabel, this.fieldPlaceholder, this.fieldType, this.dbColumn, this.required);
    }
  }

  /**
   * Save a field that was edited
   *
   * */
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

  /**
   * Check if certain mandatory fields aren't empty
   *
   * */
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

  /**
   * Push a field to the form structure
   *
   * @param     fieldLabel - the label of the field
   * @param     fieldPlaceholder - the placeholder of the field
   * @param     fieldType - the type of the field
   * @param     dbColumn - the linked data base column
   * @param     required - whether the field is required or not
   * */
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

  /**
   * Generate a random and unique fieldname
   *
   * @return    string
   * */
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

  /**
   * Dismiss the field that is currently open
   * in the field editor
   * */
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

  /**
   * Delete a field from the form structure
   *
   * @param     name - unique field name
   * @param     dbColumn - the link data base column
   * */
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

  /**
   * Load the form into the editor
   *
   * @param     formObj - the object that holds all the form metadata and structure
   * */
  loadForm(formObj: any) {
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

  /**
   * Post form metadata and structue to the back-end
   *
   * @param     action - 'save' | 'add': whether a form should be added or saved
   * */
  postForm(action: string) {
    if (this.validateForm()) {
        this.formsService.postForm(this.formName, this.identifier, this.dbTable, this.structure, action, this.formId).subscribe(res => {
            if (res['status'] === 200) {
                this.alert.alert.next(new Alert('The form was successfully saved.', 'success'));
                this.dismissForm();
                this.formsService.getForms();
            } else {
                this.errorMsg = res['message'];
            }
        });
    }
  }

  /**
   * Check if the form has the required information
   * and if the form identifier isn't already taken
   *
   * @return    boolean
   * */
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

  /**
   * Generate form identifier
   *
   * */
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

  /**
   * Show a form field in the field editor for editing
   *
   * @param     name - unique field name
   * */
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

  /**
   * Dismiss the form that is currently opened in the editor
   *
   * */
  dismissForm() {
      this.dismissFields();
      this.editingForm = false;
      this.formName = '';
      this.identifier = '';
      this.structure = [];
      this.dbTable = '';
      this.formsService.showForm.next(false);
      this.formsService.title.next('New form');
  }

  /**
   * Get all table columns
   *
   * */
  getTableColumns() {
      this.dataTablesService.getTableColumns(this.dbTable);
  }

  /**
   * Toggle the field editor
   *
   * */
  toggleFieldEditor() {
      this.showFieldEditor = true;
      if (this.columns.length === 0) {
          this.dataTablesService.getTableColumns(this.dbTable);
      }
  }

  /**
   * On destroy, unsubscribe all component subscriptions
   * and dismiss the field that is currently open in the editor
   * */
  ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
      this.dismissFields();
  }

}
