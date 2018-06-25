import { Component, OnInit, Input } from '@angular/core';
import { CUSTOM_QUILL_MODULES } from './custom-quill-modules';
import { PropertiesService } from '../../../../services/properties.service';
import { IOption } from 'ng-select';
import { ProcessService } from '../../../../services/process.service';

declare var require;
const $ = require('jQuery');

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input('data') fieldBindings = {};
  protected metaDataOpen = false;
  protected id = '';
  protected subs = [];
  protected users: Array<IOption>;
  protected decisionsItems = [];
  protected quillModules = CUSTOM_QUILL_MODULES;
  protected showDecisions = false;

  constructor (
      private propertiesService: PropertiesService,
      private processService: ProcessService
  ) { }

  ngOnInit() {
    if (!('attach-form-contents' in this.fieldBindings)) {
      this.fieldBindings['attach-form-contents'] = true;
    }
    this.subs.push(
      this.processService.getUsers().subscribe(users => this.users = users),
      this.propertiesService.showDecisions.subscribe(boolean => this.showDecisions = boolean),
      this.propertiesService.selectedPropertyIdAndType.subscribe(data => this.id = data.id)
    );
  }

  /**
   * Update the property when the value of the corresponding model has changed
   *
   * @param property - name of the property
   * @param updateNativeProperty - whether the native property also should be updated.
   * */
  updateProperty(property: string, updateNativeProperty?: boolean) {
    if (updateNativeProperty) {
      const id = this.propertiesService.selectedPropertyIdAndType.getValue()['id'];
      this.propertiesService.updateNativeProperty.next({id: id, property: property, value: this.fieldBindings[property]});
    }
  }

  /**
   * Initialize some properties of the Quill wysiwyg editor
   *
   * @param editor - an instance of the Quill wysiwyg editor
   * */
  initEditor(editor) {
    const tooltip = editor.theme.tooltip;
    const input = tooltip.root.querySelector('input[data-link]');
    input.dataset.link = 'https://example.com';
  }

  /**
   * Make decision multiple input field free input by adding dynamically
   * an updated value to the dropdown items of the input field.
   * Also check if the entered decision already exists.
   *
   * @param event - key up event that input holds the element
   * */
  decisionInput(event) {
    const value = $(event.srcElement).val();
    let existingDecisions = 0;
    if (this.fieldBindings.hasOwnProperty('decisions')) {
        this.fieldBindings['decisions'].forEach(decision => {
            if (decision['value'].toLowerCase() === value.toLowerCase()) {
                existingDecisions++;
            }
        });

        if (value !== '' && !existingDecisions && value.replace(/\s/g, '').length) {
            this.decisionsItems = [{label: value, value: value}];
        } else {
            this.decisionsItems = [];
        }
    } else {
      this.fieldBindings['decisions'] = [];
    }
  }

  /**
   * Reset the items of the decision dropdown multiselect menu
   * */
  resetItems() {
      this.decisionsItems = [];
  }

  /**
   * Clear the value in the datepicker
   *
   * @param   property - the name of the property that is bound to the datepicker
   * */
  clearDatePicker(property: string) {
      this.fieldBindings[property] = null;
  }

  /**
   * Function to determine whether the Quill toolbar should scroll with its parent
   *
   * */
  onScroll() {
    const offset = $('#scroll-ref .ng-scrollbar-container .ng-scrollbar-view').scrollTop();
    if (offset >= 288) {
      $('#scroll-ref .ng-scrollbar-container .ng-scrollbar-view .message quill-editor .ql-toolbar').css({top: offset + 12 + 'px'});
    } else {
      $('#scroll-ref .ng-scrollbar-container .ng-scrollbar-view .message quill-editor .ql-toolbar').css({top: '300px'});
    }
  }

}
