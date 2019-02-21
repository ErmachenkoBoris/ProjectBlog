import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import Backendless from 'backendless';


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

Backendless.initApp(environment.backendless.APP_ID, environment.backendless.API_KEY);

@NgModule({
  declarations: [
    AppComponent,
    AppMainPageComponent,
    AutorizationFormComponent,
    RegisterFormComponent,
    UserAuthorizedPageComponent,
    ReadingArticleComponent,
    AddArticleComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
 export class AppModule { }
