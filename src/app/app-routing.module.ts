import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AppMainPageComponent} from './app-main-page/app-main-page.component';
import {UserAuthorizedPageComponent} from './user-authorized-page/user-authorized-page.component';
import {ReadingArticleComponent} from './user-authorized-page/reading-article/reading-article.component';
import {AddArticleComponent} from './user-authorized-page/add-article/add-article.component';

const routes: Routes = [
  { path: '', component: AppMainPageComponent },
  { path: 'user/:login', component: UserAuthorizedPageComponent, children: [
      {path: ':nameArticle', component: ReadingArticleComponent, outlet: 'article_read' },
      {path: ':nameTopic', component: AddArticleComponent, outlet: 'article_add' }
    ]},
  {path: 'user/:login/:nameArticle', component: ReadingArticleComponent, outlet: 'article_read' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
