import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import Backendless from 'backendless';
import {APP_BASE_HREF} from '@angular/common';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppMainPageComponent } from './app-main-page/app-main-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AutorizationFormComponent } from './app-main-page/autorization-form/autorization-form.component';
import { RegisterFormComponent } from './app-main-page/register-form/register-form.component';
import { AppRoutingModule } from './app-routing.module';
import { UserAuthorizedPageComponent } from './user-authorized-page/user-authorized-page.component';
import { ReadingArticleComponent } from './user-authorized-page/reading-article/reading-article.component';
import { AddArticleComponent } from './user-authorized-page/add-article/add-article.component';
import { FormsModule } from '@angular/forms';
import { AdminAuthorisedPageComponent } from './admin-authorised-page/admin-authorised-page.component';
import { AddArticleAdminComponent } from './admin-authorised-page/add-article-admin/add-article-admin.component';
import { ReadingArticleAdminComponent } from './admin-authorised-page/reading-article-admin/reading-article-admin.component';
import { UserControlComponent } from './admin-authorised-page/user-control/user-control.component';
import { AddUserComponent } from './admin-authorised-page/user-control/add-user/add-user.component';
import { SendEmailsComponent } from './admin-authorised-page/user-control/send-emails/send-emails.component';
import { SuggestArticlesComponent } from './admin-authorised-page/suggest-articles/suggest-articles.component';
import { ReadArticleComponent } from './admin-authorised-page/suggest-articles/read-article/read-article.component';
import { ArticleControlComponent } from './admin-authorised-page/article-control/article-control.component';
import { ErrorPageComponentComponent } from './error-page-component/error-page-component.component';

Backendless.initApp(environment.backendless.APP_ID, environment.backendless.API_KEY);
// const PAGESIZE = 80;
// const dataQuery = new Backendless.DataQuery();

// Backendless.initApp( environment.backendless.APP_ID, environment.backendless.API_KEY);
// dataQuery.options = {
  // pageSize: PAGESIZE
// };

@NgModule({
  declarations: [
    AppComponent,
    AppMainPageComponent,
    AutorizationFormComponent,
    RegisterFormComponent,
    UserAuthorizedPageComponent,
    ReadingArticleComponent,
    AddArticleComponent,
    AdminAuthorisedPageComponent,
    AddArticleAdminComponent,
    ReadingArticleAdminComponent,
    UserControlComponent,
    AddUserComponent,
    SendEmailsComponent,
    SuggestArticlesComponent,
    ReadArticleComponent,
    ArticleControlComponent,
    ErrorPageComponentComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule, AppRoutingModule, FormsModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [AppComponent]
})
 export class AppModule {
}
