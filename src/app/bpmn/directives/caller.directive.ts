import { Directive, Input, HostListener } from '@angular/core';
import { BpmnService } from '../services/bpmn.service';

declare var require;
const $ = require('jQuery');

@Directive({
    selector: '[caller]'
})

export class CallerDirective {

    @Input('caller') caller: string;

    constructor(private bpmn: BpmnService) {}

    @HostListener('click', ['$event']) onClick(event: MouseEvent) {
        const targetElemType = $(event.target).attr('type');
        if (targetElemType === 'submit') {
          this.validateForm();
        }
    }

    private validateForm() {
        const errors = [];
        const formData = this.getFormData();
        formData.data.forEach(item => {
           if (item.required && item.value === '') {
               errors.push('\'' + item.label + '\'' + ' is required.');
           }
        });

        if (errors.length === 0) {
            this.postForm(formData);
        }
    }

    private getFormData() {
        const formGroups = $('form[ng-reflect-form="' + this.caller + '"]').children();
        const formData = {data: []};
        formGroups.each(i => {
            const groupItems = $(formGroups[i]).children();
            groupItems.each(index => {
                if (groupItems[index].classList.contains('input')) {
                    const id = $(groupItems[index]).attr('id');
                    const val = $(groupItems[index]).val();
                    const col = $(groupItems[index]).attr('data-col');
                    const lbl = $('label[for="' + id + '"]').text();
                    const req = $(groupItems[index]).prop('required');
                    formData.data.push({name: id, value: val, column: col, required: req, label: lbl});
                }
            });
        });
        return formData;
    }

    private postForm(formData: any) {
        this.bpmn.postData(this.caller, formData).subscribe(res => {
            if (res['status'] === 200) {
                this.bpmn.call(this.caller, res['db_table'], res['insert_id']).subscribe(resp => {
                    console.log(resp);
                });
            }
        });
    }
}
