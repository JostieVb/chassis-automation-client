import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormLoadService } from '../services/form-load.service';

declare var require;
const $ = require('jQuery');

@Directive({
    selector: '[form]'
})

export class FormDirective implements OnInit, OnDestroy {

    /**
     * form         :       identifier of the form
     * subs         :       directive subscriptions
     * */
    @Input('form') form: string;
    private subs = [];

    constructor(private formLoader: FormLoadService) {}

    ngOnInit() {
      this.showLoadingIndicator();
      this.subs.push(
        this.formLoader.load(this.form).subscribe(form => {
            if (Object.keys(form).length > 0) {
                this.buildForm(form);
            } else {
                this.showPlaceholder();
            }
        })
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
                    '<textarea autocorrect="off" spellcheck="off" data-req="' + item['required'] + '" autocomplete="off" data-col="' + item['dbColumn'] + '" id="' + item['fieldName'] + '" class="form-control input textarea" name="' + item['fieldName'] + '" placeholder="' + item['fieldPlaceholder'] + '" required="' + item['required'] + '"></textarea></div>';
            } else {
                html += '<div class="form-group"><label for="' + item['fieldName'] + '" class="' + required + '">' + item['fieldLabel'] + '</label>' +
                    '<input autocorrect="off" spellcheck="off" data-req="' + item['required'] + '" autocomplete="off" type="' + item['fieldType'] + '" data-col="' + item['dbColumn'] + '" id="' + item['fieldName'] + '" class="' + required + ' form-control input" name="' + item['fieldName'] + '" placeholder="' + item['fieldPlaceholder'] + '" required="' + item['required'] + '" /"></div>';
            }
        });
        $('*[data-form]').show();
        parent.append(html);
    }

    /**
     * No form is available for a build,
     * show a placeholder
     *
     * */
    private showPlaceholder() {
        $('*[data-form]').hide();
        const parent = $('form[ng-reflect-form="' + this.form + '"]');
        const placeholder = '<div class="no-form-msg"><div class="head">No form available for \'' + this.form + '\'</div><div class="body">A <span>form</span> directive is set to show the <span>' + this.form + '</span> form, but this form is not available. Please create a new form with the <a routerLink="/forms">form builder</a> and name it \'' + this.form + '\'.</div></div>';
        parent.append(placeholder);
    }

    /**
     * Show loading indicator when loading the form/placeholder
     *
     * */
    private showLoadingIndicator() {
        const parent = $('form[ng-reflect-form="' + this.form + '"]');
        parent.html('<i class="fa fa-circle-o-notch fa-spin"></i>');
    }

    /**
     * When the directive gets destroyed, unsubscribe all subscriptions
     * */
    ngOnDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }
}
