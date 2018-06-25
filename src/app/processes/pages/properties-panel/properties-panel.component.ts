import { Component, OnDestroy, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { IOption } from 'ng-select';
import { UserService } from '../../../auth/user.service';
import { ProcessService } from '../../services/process.service';
import { FormsService } from '../../../forms/services/forms.service';
import { SelectedProperty } from '../../models/selected-property';

@Component({
  selector: 'app-properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent implements OnInit, OnDestroy {

  protected id = '';
  protected type = '';
  protected data = {};
  protected properties = {};
  protected forms: Array<IOption> = [];
  protected users: Array<IOption> = [];
  private subs = [];

  constructor(
      private propertiesService: PropertiesService,
      private auth: UserService,
      private processService: ProcessService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.processService.getForms().subscribe(forms => this.forms = forms),
      this.propertiesService.properties.subscribe(properties => this.properties = properties),
      this.propertiesService.selectedPropertyIdAndType.subscribe(selectedProperty => {
        this.id = selectedProperty.id;
        this.type = selectedProperty.type;
        if (this.properties.hasOwnProperty(this.id)) {
          this.data = this.properties[this.id];
        } else {
          this.data = {};
        }
      })
    );
  }

  /**
   * Dismiss the properties panel
   * */
  dismissPropertiesPanel() {
    this.propertiesService.selectedPropertyIdAndType.next(new SelectedProperty('', ''));
  }

  /**
   * On destroy, unsubscribe all subscriptions
   * */
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
