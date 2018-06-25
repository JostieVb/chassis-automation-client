import { Directive, Input, HostListener } from '@angular/core';
import { BpmnService } from '../services/bpmn.service';
import { Alert } from '../../components/alert/alert';
import { AlertService } from '../../components/services/alert.service';
import { EntriesService } from '../../entries/services/entries.service';

declare var require;
const $ = require('jQuery');

@Directive({
    selector: '[caller]'
})

export class CallerDirective {

    @Input('caller') caller: string;

    constructor(
        private bpmn: BpmnService,
        private alert: AlertService,
        private entries: EntriesService
    ) {}

    @HostListener('click', ['$event']) onClick(event: MouseEvent) {
        const targetElemType = $(event.target).attr('type');
        if (targetElemType === 'submit') {
          this.validateForm($(event.target));
        }
    }

    /**
     * Validate the form based on form rules set in the form builder
     *
     * @param       target - the clicked element to submit the form
     * */
    private validateForm(target) {
        const errors = [];
        const formData = this.getFormData();
        formData.data.forEach(item => {
           if (item.required === 'true' && item.value === '') {
               errors.push('\'' + item.label + '\'');
           }
        });

        if (errors.length === 0) {
            const oldBtnText = target.text();
            target.prop('disabled', true);
            target.html('<i class="fa fa-circle-o-notch fa-spin"></i> ' + oldBtnText);
            this.postForm(formData, target, oldBtnText);
        } else {
            let alertMessage = '';
            if (errors.length === 1) {
                alertMessage = errors[0] + ' is a required field.';
            } else {
                alertMessage = errors.join(', ') + ' are required fields.';
            }
            this.alert.alert.next(new Alert(alertMessage, 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, false));
        }
    }

    /**
     * Iterate through form to get the form data
     *
     * */
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
                    const req = $(groupItems[index]).attr('data-req');
                    formData.data.push({name: id, value: val, column: col, required: req, label: lbl});
                }
            });
        });
        return formData;
    }

    /**
     * Post form data. When the data is successfully posted, call to the back-end bpmn engine
     *
     * @param   formData - the form data
     * @param   target - the submit button
     * @param   oldBtnText - old text that was shown on the button
     * */
    private postForm(formData: any, target: any, oldBtnText: string) {
        this.bpmn.postData(this.caller, formData).subscribe(res => {
            if (res['status'] === 200) {
                this.alert.alert.next(new Alert('The form was successfully submitted.', 'success', '', true, false));
                this.bpmn.data.next(res['data']);
                $('form[ng-reflect-form="' + this.caller + '"]')[0].reset();
                this.bpmn.call(this.caller, res['insert_id']).subscribe(resp => {
                    if (resp['status'] !== 200) {
                        this.alert.alert.next(new Alert(
                           'Something went wrong during the execution of the process in the background: ' + resp['message'],
                           'danger',
                           'Error ' + resp['status'],
                           false,
                            true,
                            false,
                            0
                        ));
                    }
                });
                this.entries.countUnreadEntries();
            } else {
                this.alert.alert.next(new Alert('The form couldn\'t be submitted due to an unknown error.', 'danger', '<i class="fa fa-exclamation-circle" aria-hidden="true"></i>', true, true, false, 0));
            }
            target.html(oldBtnText);
            target.prop('disabled', false);
        });
    }
}
