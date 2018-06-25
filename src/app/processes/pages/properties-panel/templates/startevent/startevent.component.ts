import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PropertiesService } from '../../../../services/properties.service';
import { ProcessService } from '../../../../services/process.service';

@Component({
  selector: 'app-startevent',
  templateUrl: './startevent.component.html',
  styleUrls: ['./startevent.component.scss']
})
export class StarteventComponent implements OnInit, OnDestroy {


  @Input('data') fieldBindings = {};
  protected metaDataOpen = false;
  protected id = '';
  protected forms = [];
  private subs = [];

  constructor(
    private propertiesService: PropertiesService,
    private processService: ProcessService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.processService.getForms().subscribe(forms => this.forms = forms),
      this.propertiesService.selectedPropertyIdAndType.subscribe(data => this.id = data.id)
    );
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

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
