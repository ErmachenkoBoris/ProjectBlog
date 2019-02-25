import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {Article, ArticleName} from '../article.service';
import {ArticleTopic} from '../article.service';
import {ArticleService} from '../article.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-user-authorized-page',
  templateUrl: './user-authorized-page.component.html',
  styleUrls: ['./user-authorized-page.component.less']
})
export class UserAuthorizedPageComponent implements OnInit, DoCheck {
  constructor(public articleService: ArticleService, public router: Router, public activatedRoute: ActivatedRoute) {
  }
  read_article = 0;
  name_for_read: string;
  back_color = '#0e60a1';
  select_button_index = -1;
  background_menu_array: string[] = [];
  loginUser: string;
  article_Name: ArticleName[] = [];
  access_suggest: string;
  scope_read_boolean = false;
  scope_comment_boolean = false;
  scope_read_boolean__item = false;
  scope_comment_boolean__item = false;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
       this.loginUser = params['login'];
    });
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login = '';
    if (currentUser) {
      login = currentUser.login;
      this.access_suggest = currentUser.access_suggest;
    }
    if (!login || login !== this.loginUser || !this.loginUser) {
      this.router.navigate(['']);
    }
    this.articleService.Load_all_topics();
    for (let i = 0; i < this.articleService.topics.length; i++) {
      this.background_menu_array[i] = '';
    }
    if (this.articleService.articles_choosen_names) {
      let k = 0;
      for (let i = 0; i < this.articleService.articles_choosen_names.length; i++) {
        const flag = this.access_read(this.articleService.articles_choosen_names[i]);
        if (flag) {
          this.article_Name[k] = this.articleService.articles_choosen_names[i];
          if (this.articleService.articles_choosen_names.length !== i + 1) {
            k++;
          }
        }
      }
    }
  }
  ngDoCheck(): void {
    if (this.articleService.articles_choosen_names) {
      let k = 0;
      for (let i = 0; i < this.articleService.articles_choosen_names.length; i++) {
        const flag = this.access_read(this.articleService.articles_choosen_names[i]);
        if (flag) {
          this.article_Name[k] = this.articleService.articles_choosen_names[i];
          if (this.articleService.articles_choosen_names.length !== i + 1) {
            k++;
          }
        }
      }
      this.article_Name.length = k + 1;
    }
  }
  change_back_info(index: number) {
    if (index !== 10) {
      index++;
      const r = 14 + index * 33;
      const g = 96 + index;
      const b = 161 + index;
      this.back_color = `rgb(${r},${g}, ${b})`;
    } else {
      this.back_color = `rgb(14,96, 161)`;
    }
  }

  choose_articles(name: string) {
    this.articleService.Load_choose_Articles_names(name);
  }

  Set_name(name: string): void {
    this.name_for_read = name;
  }
  select_button(index: number): void {
    if (this.select_button_index !== index) {
      this.background_menu_array[this.select_button_index] = '';
      this.background_menu_array[index] = '#00daff';
      this.select_button_index = index;
    }
  }
  access_read(articleName: ArticleName): number {
    if (articleName.access_read === 'all') {
      return 1;
    } else {
      const tmpEmails = articleName.access_read.split(' ');
      for (let i = 0 ; i < tmpEmails.length; i++) {
        if (tmpEmails[i] === articleName.access_read) {
          return 1;
        }
      }
    }
    return 0;
}
  Change_reading_scope(): void {
    this.scope_read_boolean = !this.scope_read_boolean;
  }
  Change_comment_scope(): void {
    this.scope_comment_boolean = !this.scope_comment_boolean;
  }
  Change_reading_scope__item(): void {
    this.scope_read_boolean__item = !this.scope_read_boolean__item;
  }
  Change_comment_scope__item(): void {
    this.scope_comment_boolean__item = !this.scope_comment_boolean__item;
  }
}
