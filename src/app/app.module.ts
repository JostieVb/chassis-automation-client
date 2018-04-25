/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ng5BreadcrumbModule } from 'ng5-breadcrumb';
import { ScrollbarModule } from 'ngx-scrollbar';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { SelectModule } from 'ng-select';

/* Services */
import { ProductsService } from './products/services/products.service';
import { ProcessService } from './processes/services/process.service';
import { FlowLoadService } from './processes/services/flowload.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { DeployService } from './processes/services/deploy.service';
import { DeleteService } from './processes/services/delete.service';
import { DashboardService } from './dashboard/services/dashboard.service';
import { AlertService } from './components/services/alert.service';
import { PropertiesService } from './processes/services/properties.service';
import { EntriesService } from './entries/services/entries.service';
import { BpmnService } from './bpmn/services/bpmn.service';
import { UserService } from './auth/user.service';
import { SidebarService } from './components/services/sidebar.service';
import { GuardService } from './auth/guard.service';
import { FormLoadService } from './bpmn/services/form-load.service';
import { FormsService } from './forms/services/forms.service';

/* Directives */
import { CallerDirective } from './bpmn/directives/caller.directive';
import { FormDirective } from './bpmn/directives/form.directive';

/* Pipes */
import { KeysPipe } from './bpmn/pipes/keys.pipe';

/* Components */
import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';
import { ModelerComponent } from './processes/pages/modeler/modeler.component';
import { ProcessesComponent } from './processes/pages/process/processes.component';
import { ProcessesOverviewComponent } from './processes/pages/processes-overview/processes-overview.component';
import { FormsComponent } from './forms/pages/forms/forms.component';
import { ProductsComponent } from './products/pages/products/products.component';
import { ProductsOverviewComponent } from './products/pages/products-overview/products-overview.component';
import { ProductsAddComponent } from './products/pages/products-add/products-add.component';
import { EntriesOverviewComponent } from './entries/pages/entries-overview/entries-overview.component';
import { EntriesComponent } from './entries/pages/entries/entries.component';
import { EntriesDetailComponent } from './entries/pages/entries-detail/entries-detail.component';
import { DeployComponent } from './processes/modals/deploy/deploy.component';
import { AlertComponent } from './components/alert/alert.component';
import { EditElementPropertiesComponent } from './processes/modals/edit-element-properties/edit-element-properties.component';
import { DeleteProcessComponent } from './processes/modals/delete-process/delete-process.component';
import { EntriesProgressComponent } from './dashboard/pages/entries-progress/entries-progress.component';
import { NewProcessModalComponent } from './processes/modals/new-process/new-process.modal';
import { ViewerComponent } from './processes/pages/viewer/viewer.component';
import { LoginComponent } from './components/login/login.component';
import { FormsOverviewComponent } from './forms/pages/forms-overview/forms-overview.component';
import { FormsAddComponent } from './forms/pages/forms-add/forms-add.component';
import { DataTablesComponent } from './data-tables/pages/data-tables/data-tables.component';
import { DataTablesService } from './data-tables/services/data-tables.service';
import { DataTablesOverviewComponent } from './data-tables/pages/data-tables-overview/data-tables-overview.component';
import { DataTablesDetailComponent } from './data-tables/pages/data-tables-detail/data-tables-detail.component';
import { NewTableComponent } from './data-tables/modals/new-table/new-table.component';
import { NewColumnComponent } from './data-tables/modals/new-column/new-column.component';
import { DeleteDataTableComponent } from './data-tables/modals/delete-data-table/delete-data-table.component';

/* Routes */
const appRoutes: Routes = [
    {
      path: '',
      component: DashboardComponent,
      canActivate: [GuardService],
      data: {
        permission: 'dashboard'
      }
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [GuardService],
      data: {
        permission: 'dashboard'
      }
    },
    {
      path: 'entries',
      component: EntriesComponent,
      canActivate: [GuardService],
      data: {
        permission: 'entries'
      }
    },
    {
      path: 'products',
      component: ProductsComponent,
      canActivate: [GuardService],
      data: {
        permission: 'products'
      }
    },
    {
      path: 'processes',
      component: ProcessesComponent,
      canActivate: [GuardService],
      data: {
        permission: 'processes'
      }
    },
    {
      path: 'processes/:param',
      canActivate: [GuardService],
      component: ModelerComponent,
      data: {
        permission: 'processes'
      }
    },
    {
      path: 'forms',
      component: FormsComponent,
      canActivate: [GuardService],
      data: {
        permission: 'forms'
      }
    },
    {
        path: 'data-tables',
        component: DataTablesComponent,
        canActivate: [GuardService],
        data: {
            permission: 'data-tables'
        }
    },
    {
      path: 'login',
      component: LoginComponent
    }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    DashboardComponent,
    ModelerComponent,
    ProcessesComponent,
    ProcessesOverviewComponent,
    NewProcessModalComponent,
    FormsComponent,
    ProductsComponent,
    ProductsOverviewComponent,
    ProductsAddComponent,
    EntriesOverviewComponent,
    EntriesComponent,
    EntriesDetailComponent,
    DeployComponent,
    AlertComponent,
    EditElementPropertiesComponent,
    DeleteProcessComponent,
    EntriesProgressComponent,
    CallerDirective,
    FormDirective,
    ViewerComponent,
    LoginComponent,
    FormsOverviewComponent,
    FormsAddComponent,
    KeysPipe,
    DataTablesComponent,
    DataTablesOverviewComponent,
    DataTablesDetailComponent,
    NewTableComponent,
    NewColumnComponent,
    DeleteDataTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    Ng5BreadcrumbModule.forRoot(),
    ScrollbarModule,
    LoadingBarHttpClientModule,
    UiSwitchModule,
    SelectModule
  ],
  exports: [
    CallerDirective,
    FormDirective
  ],
  providers: [
      FlowLoadService,
      ProductsService,
      ProcessService,
      LoadingBarService,
      EntriesService,
      DeployService,
      AlertService,
      PropertiesService,
      DeleteService,
      DashboardService,
      BpmnService,
      UserService,
      SidebarService,
      GuardService,
      FormLoadService,
      FormsService,
      DataTablesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
