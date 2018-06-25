import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { DataTablesService } from '../../../data-tables/services/data-tables.service';
import { Alert } from '../../../components/alert/alert';
import { AlertService } from '../../../components/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { FORM_BUILDER_ITEMS } from '../../form-builder-items';
import { Form } from '../../models/form';
import { FormField } from '../../models/form-field';
import { Router } from '@angular/router';
import { CUSTOM_QUILL_MODULES } from '../../../processes/pages/properties-panel/templates/task/custom-quill-modules';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit, OnDestroy {

  /**
   * param              :       the parameter of the route
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
   * occupiedIds        :       an object that holds all of the existing form identifiers
   * editField          :       boolean that tells whether a field is being edited
   * tables             :       an array of all data tables with pre-fix 'ca_'
   * columns            :       an array of the select data table's columns with pre-fix 'ca_'
   * dbColumn           :       the selected database column
   * editingForm        :       boolean that tells whether a form is being edited
   * editingFieldName   :       boolean that tells whether the fieldname is being edited
   * formId             :       the current form id (number)
   * subs               :       component subscriptions
   * */
  protected param = '';
  protected loading = true;
  protected draggingNewItem = false;
  protected editFormItem = false;
  protected fields = [];
  protected form = new Form(0, 'test', 'test' , []);
  protected formItemsKeys = [];
  protected editingForm = false;
  protected formId = 0;
  protected formBuilderItems = FORM_BUILDER_ITEMS;
  protected savingForm = false;
  protected quillModules = CUSTOM_QUILL_MODULES;
  private subs = [];

  constructor(
    private formsService: FormsService,
    private dataTablesService: DataTablesService,
    private alert: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * On componet initialization, get all form identifiers, data tables,
   * column from selected data table and the current form and the form id
   *
   * */
  ngOnInit() {
    this.subs.push(
      this.formsService.editFormItem.subscribe(bool => this.editFormItem = bool),
      this.formsService.form.subscribe(form => {
        console.log(form);
        this.formatFormData(form);
        }),
        this.formsService.loadingForm.subscribe(loading => this.loading = loading),
        this.formsService.editedFieldData.subscribe(data => this.saveFormField(data)),
        this.route.params.subscribe(params => {
          this.formId = params['param'];
          this.formsService.loadForm(params['param']);
        })
    );
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
   * Load the form into the editor
   *
   * @param     form - the object that holds all the form metadata and structure
   * */
  formatFormData(form: any) {
    if (form.identifier !== '') {
      this.form.id = form['id'];
      this.form.name = form['name'];
      this.fields = JSON.parse(form['structure']);
      this.form.identifier = form['identifier'];
      this.sortFields(this.fields);
      this.editingForm = true;
    }
  }

  /**
   * Drop an item in the droppable container
   *
   * @param     event - the drop event
   * */
  dropNewItem(event) {
    this.formsService.editField.next(false);
    const id = this.generateFieldname();
    this.fields[id] = {name: 'New \'' + event.dragData + '\' field', type: event.dragData, required: false, showToolbar: true, sort: this.formItemsKeys.length + 1};
    this.sortFields(this.fields);
    this.formsService.field.next(new FormField(id, '', '', event.dragData, false));
    this.formsService.editFormItem.next(true);
  }

  dropExistingItem(event) {
    console.log(event);
  }

  /**
   * Sort the fields and put sorted keys of the fields in 'formItemKeys' property for iteration in the template
   *
   * @param     fields - an object that holds the form fields
   * */
  sortFields(fields: any) {
    const sortables = [];
    const keys = [];
    for (const key in fields) {
      if (key in fields) {
        sortables.push([key, this.fields[key]['sort']]);
      }
    }
    sortables.sort(function(a, b) {
      return a[1] - b[1];
    });
    let count = 1;
    sortables.forEach(sortable => {
      this.fields[sortable[0]]['sort'] = count;
      keys.push(sortable[0]);
      count++;
    });
    this.formItemsKeys = keys;
  }

  /**
   * Save a form field that was edited
   *
   * @param   field - an object that holds the edited field
   * */
  saveFormField(field: any) {
    if (field.id !== '') {
      if (!field['sort']) {
        field['sort'] = this.formItemsKeys.length;
      }
      this.fields[field.id] = field;
    }
  }

  /**
   * Delete an item from the form
   *
   * @param   id - id of the item that should be deleted
   * */
  deleteFormField(id: string) {
    delete this.fields[id];
    this.sortFields(this.fields);
  }

  /**
   * Edit a form field
   *
   * @param   id - id of the item that should be edited
   * */
  editFormField(id: string) {
    this.formsService.editField.next(true);
    this.formsService.editFormItem.next(true);
    const field = this.fields[id];
    this.formsService.field.next(new FormField(id, field.name, field.description, field.type, field.required));
  }

  /**
   * Save the form in the database
   * */
  saveForm() {
    this.savingForm = true;
    const form = this.formsService.form.getValue();
    form['structure'] = this.fields;
    this.formsService.saveForm(form).subscribe(res => {
      if (res['status'] === 200) {
        this.alert.alert.next(new Alert('The form was successfully saved.', 'success', '', true));
      } else {
        this.alert.alert.next(new Alert(
            'The form could not be save due to an unknown reason.',
            'danger',
            '<i class="fa fa-exclamation-circle"></i>',
            true)
        );
      }
      this.savingForm = false;
    });
  }

  /**
   * Dismiss the form builder and navigate back to the forms overview
   *
   * */
  dismissFormBuilder() {
    this.router.navigate(['/forms']);
  }

  /**
   * On Quill WYSIWYG editor initialization
   *
   * */
  initEditor(editor) {
    editor.disable();
  }

  /**
   * On destroy, unsubscribe all component subscriptions
   * and dismiss the field that is currently open in the editor
   * */
  ngOnDestroy() {
      this.formsService.form.next(new Form(0, '', '', []));
      this.formsService.loadingForm.next(true);
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
