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
            if (Object.keys(form[0]['structure']).length > 0) {
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
        const ids = this.sortFields(form);
        const parent = $('form[ng-reflect-form="' + this.form + '"]');
        let html = '';
        ids.forEach(id => {
            const item = form[id];
            let required = '';
            if (item['required']) {
                required = 'required';
            }
            if (item['type'] === 'textarea') {
                html += '<div class="form-group"><label for="' + id + '" class="' + required + '">' + item['name'] + '</label>' +
                    '<textarea autocorrect="off" spellcheck="off" data-req="' + item['required'] + '" autocomplete="off" id="' + id + '" class="form-control input textarea" name="' + id+ '" placeholder="' + item['description'] + '" required="' + item['required'] + '"></textarea></div>';
            } else if (item['type'] === 'title') {
                html += '<div class="form-group"><h5 style="padding: 0 !important; margin: 0 !important;">' + item['name'] + '</h5></div>';
            }  else if (item['type'] === 'subtitle') {
                html += '<div class="form-group"><p>' + item['name'] + '</p></div>';
            } else {
                html += '<div class="form-group"><label for="' + id + '" class="' + required + '">' + item['name'] + '</label>' +
                    '<input autocorrect="off" spellcheck="off" data-req="' + item['required'] + '" autocomplete="off" type="' + item['type'] + '" id="' + id + '" class="' + required + ' form-control input" name="' + id + '" placeholder="' + item['description'] + '" required="' + item['required'] + '" /"></div>';
            }
        });
        $('*[data-form]').show();
        parent.append(html);
    }

    private sortFields(fields: any) {
      const sortables = [];
      const keys = [];
      for (const key in fields) {
        if (key in fields) {
          sortables.push([key, fields[key]['sort']]);
        }
      }
      sortables.sort(function(a, b) {
        return a[1] - b[1];
      });
      sortables.forEach(sortable => keys.push(sortable[0]));
      return keys;
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
