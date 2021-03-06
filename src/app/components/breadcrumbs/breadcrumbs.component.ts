import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'ng5-breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbService.addFriendlyNameForRouteRegex('/processes/[0-9]', 'Process');
    this.breadcrumbService.addFriendlyNameForRouteRegex('/processes/new', 'New');
    this.breadcrumbService.addFriendlyNameForRouteRegex('/forms/[0-9]', 'Form');
    this.breadcrumbService.addFriendlyNameForRoute('/', 'Dashboard');
  }
}
