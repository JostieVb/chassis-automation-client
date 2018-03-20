/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ng5BreadcrumbModule } from 'ng5-breadcrumb';
import { LoadingBarModule } from '@ngx-loading-bar/core';

/* Services */
import { ProductsService } from './products/services/products.service';
import { ProcessService } from './processes/services/process.service';
import { FlowLoadService } from './modeler/services/flowload.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

/* Components */
import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';
import { ModelerComponent } from './modeler/pages/modeler/modeler.component';
import { ProcessesComponent } from './processes/pages/process/processes.component';
import { ProcessesOverviewComponent } from './processes/pages/processes-overview/processes-overview.component';
import { NewProcessModalComponent } from './processes/modals/new-process/new-process.modal';
import { ConfigurationComponent } from './configuration/pages/configuration/configuration.component';
import { ProductsComponent } from './products/pages/products/products.component';
import { ProductsOverviewComponent } from './products/pages/products-overview/products-overview.component';
import { ProductsAddComponent } from './products/pages/products-add/products-add/products-add.component';
import { EntriesOverviewComponent } from './entries/pages/entries-overview/entries-overview.component';
import { EntriesComponent } from './entries/pages/entries/entries.component';
import { EntriesDetailComponent } from './entries/pages/entries-detail/entries-detail.component';
import { EntriesService } from './entries/services/entries.service';

/* Routes */
const appRoutes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'entries', component: EntriesComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'processes', component: ProcessesComponent },
    { path: 'processes/:param', component: ModelerComponent },
    { path: 'configuration', component: ConfigurationComponent }
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
    ConfigurationComponent,
    ProductsComponent,
    ProductsOverviewComponent,
    ProductsAddComponent,
    EntriesOverviewComponent,
    EntriesComponent,
    EntriesDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    CommonModule,
    Ng5BreadcrumbModule.forRoot(),
    LoadingBarModule
  ],
  providers: [
      FlowLoadService,
      ProductsService,
      ProcessService,
      LoadingBarService,
      EntriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
