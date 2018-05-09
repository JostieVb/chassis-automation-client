import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormLoadService } from '../services/form-load.service';

declare var require;
const $ = require('jQuery');

@Directive({
    selector: '[form]'
})

export class FormDirective implements OnInit, OnDestroy {

    @Input('form') form: string;
    private subs = [];

    constructor(private formLoader: FormLoadService) {}

    ngOnInit() {
      this.subs.push(
        this.formLoader.load(this.form).subscribe(form => this.buildForm(form))
      );
    }

    /**
     * Append the form to the DOM
     *
     * @param   formObj - an object that holds the form structure
     * */
    protected buildForm(formObj) {
        const form = JSON.parse(formObj[0]['structure']);
        const parent = $('form[ng-reflect-form="' + this.form + '"]');
        let html = '';
        form.forEach(item => {
            let required = '';
            if (item['required']) {
                required = 'required';
            }
            if (item['fieldType'] === 'textarea') {
                html += '<div class="form-group"><label for="' + item['fieldName'] + '" class="' + required + '">' + item['fieldLabel'] + '</label>' +
                    '<textarea autocorrect="off" spellcheck="off" autocomplete="off" data-col="' + item['dbColumn'] + '" id="' + item['fieldName'] + '" class="form-control input textarea" name="' + item['fieldName'] + '" placeholder="' + item['fieldPlaceholder'] + '" required="' + item['required'] + '"></textarea></div>';
            } else {
                html += '<div class="form-group"><label for="' + item['fieldName'] + '" class="' + required + '">' + item['fieldLabel'] + '</label>' +
                    '<input autocorrect="off" spellcheck="off" autocomplete="off" type="' + item['fieldType'] + '" data-col="' + item['dbColumn'] + '" id="' + item['fieldName'] + '" class="' + required + ' form-control input" name="' + item['fieldName'] + '" placeholder="' + item['fieldPlaceholder'] + '" required="' + item['required'] + '" /"></div>';
            }
        });
        parent.append(html);
    }

    ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }
}
