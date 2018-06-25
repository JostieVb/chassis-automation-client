import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsService } from '../../../../../forms/services/forms.service';
import { PropertiesService } from '../../../../services/properties.service';

@Component({
  selector: 'app-sequenceflow',
  templateUrl: './sequenceflow.component.html',
  styleUrls: ['./sequenceflow.component.scss']
})
export class SequenceflowComponent implements OnInit, OnDestroy {

  @Input('data') fieldBindings = {};
  protected metaDataOpen = false;
  protected formFields = [];
  protected id = '';
  protected conditionsKeys = [];
  protected decisions = [];
  private subs = [];

  constructor(
      private formsService: FormsService,
      private propertiesService: PropertiesService
  ) { }

  ngOnInit() {
    if (!('conditions' in this.fieldBindings)) {
      this.fieldBindings['conditions'] = {1: {key: 'previous-decision', operator: 'equals', value: {value: '', type: 'dropdown'}}};
      this.fieldBindings['follow'] = 'all';
    }
    this.subs.push(
      this.propertiesService.decisions.subscribe(decisions => this.decisions = decisions),
      this.propertiesService.selectedPropertyIdAndType.subscribe(data => this.id = data.id)
    );
    this.formsService.getFormFields('form-new-product').subscribe(formFields => this.formFields = formFields);
    this.conditionsKeys = Object.keys(this.fieldBindings['conditions']);
  }

  /**
   * Update the corresponding property of the field bindings
   *
   * @param property - name of the property that should be edited
   * */
  updateProperty(property: string, updateNativeProperty?: boolean) {
    if (updateNativeProperty) {
      const id = this.propertiesService.selectedPropertyIdAndType.getValue()['id'];
      this.propertiesService.updateNativeProperty.next({id: id, property: property, value: this.fieldBindings[property]});
    }
  }

  /**
   * Add a new empty condition
   * */
  addEmptyCondition() {
    const id = this.generateConditionId();
    this.fieldBindings['conditions'][id] = {key: 'previous-decision', operator: 'equals', value: {value: '', type: 'dropdown'}};
    this.conditionsKeys = Object.keys(this.fieldBindings['conditions']);
  }

  /**
   * Change type of the value
   *
   * @param id - id of the selected condition
   * */
  changeValueType(id: string) {
    const type = this.fieldBindings['conditions'][id]['value']['type'];
    if (type === 'dropdown') {
      this.fieldBindings['conditions'][id]['value']['type'] = 'text';
    } else {
      this.fieldBindings['conditions'][id]['value']['type'] = 'dropdown';
    }
  }

  /**
   * Delete a condition by id
   *
   * @param id - the id of the condition that should be deleted
   * */
  deleteCondition(id) {
    if (Object.keys(this.fieldBindings['conditions']).length > 1) {
      delete this.fieldBindings['conditions'][id];
      this.conditionsKeys = Object.keys(this.fieldBindings['conditions']);
    }
  }

  /**
   * Generate a random and unique condition id
   *
   * @return    string
   * */
  generateConditionId() {
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
      return components.join('');
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
