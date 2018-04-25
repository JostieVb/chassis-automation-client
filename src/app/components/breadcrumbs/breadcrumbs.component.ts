import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'ng5-breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  /**
  * params  :   segments of current route as an array of UrlSegment Objects
   */
  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbService.addFriendlyNameForRouteRegex('/processes/[0-9]', 'Process');
    this.breadcrumbService.addFriendlyNameForRouteRegex('/processes/new', 'New');
    this.breadcrumbService.addFriendlyNameForRoute('/', 'Dashboard');
  }
}
