import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainPageComponent } from './app-main-page/app-main-page.component';
import { UserAuthorizedPageComponent } from './user-authorized-page/user-authorized-page.component';
import { ReadingArticleComponent } from './user-authorized-page/reading-article/reading-article.component';
import { AddArticleComponent } from './user-authorized-page/add-article/add-article.component';
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

const routes: Routes = [
  { path: '', component: AppMainPageComponent },
  { path: 'user/:login', component: UserAuthorizedPageComponent, children: [
      {path: ':nameArticle', component: ReadingArticleComponent, outlet: 'article_read' },
      {path: ':nameTopic', component: AddArticleComponent, outlet: 'article_add' }
    ]},
  { path: 'admin/:login', component: AdminAuthorisedPageComponent, children: [
      {path: ':nameArticle', component: ReadingArticleAdminComponent, outlet: 'article_read_admin' },
      {path: ':nameTopic', component: AddArticleAdminComponent, outlet: 'article_add_admin' },
      {path: 'control', component: UserControlComponent, outlet: 'control_user', children: [
          {path: 'add', component: AddUserComponent, outlet: 'add_user' }
        ] },
      {path: 'send', component: SendEmailsComponent, outlet: 'send_email' },
      {path: 'suggest', component: SuggestArticlesComponent, outlet: 'suggest_article',
        children: [
          {path: 'read', component: ReadArticleComponent, outlet: 'read_article' },
        ]},
      {path: 'article_control', component: ArticleControlComponent, outlet: 'article_control'}
    ]},
  {path: 'user/:login/:nameArticle', component: ReadingArticleComponent, outlet: 'article_read' },
  {path: '**', component: ErrorPageComponentComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
