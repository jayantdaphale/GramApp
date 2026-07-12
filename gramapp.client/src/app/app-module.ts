import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CompanyListComponent } from './company/company-list.component';
import { CompanyFormComponent } from './company/company-form.component';
import { CompanyDeleteComponent } from './company/company-delete.component';
import { UserListComponent } from './user/user-list.component';
import { UserFormComponent } from './user/user-form.component';
import { UserDeleteComponent } from './user/user-delete.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApiService } from './services/api.service';
import { CompanyService } from './services/company/company.service';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptorProvider } from './services/auth.interceptor';
import { Select2Directive } from './shared/select2.directive';
import { MenuGroupListComponent } from './menu/menu-group-list.component';
import { MenuListComponent } from './menu/menu-list.component';
import { MenuAccessListComponent } from './menu/menu-access-list.component';

@NgModule({
  declarations: [
    App,
    DashboardComponent,
    CompanyListComponent,
    CompanyFormComponent,
    CompanyDeleteComponent,
    UserListComponent,
    UserFormComponent,
    UserDeleteComponent,
    Select2Directive,
    MenuGroupListComponent,
    MenuListComponent,
    MenuAccessListComponent
  ],
  imports: [
    BrowserModule, CommonModule, HttpClientModule, FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    ApiService,
    CompanyService,
    UserService
    , AuthService,
    AuthInterceptorProvider
  ],
  bootstrap: [App]
})
export class AppModule { }
