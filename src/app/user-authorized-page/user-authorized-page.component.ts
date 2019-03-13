import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {Article, ArticleName} from '../article.service';
import {ArticleTopic} from '../article.service';
import {ArticleService} from '../article.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UsersService} from '../users.service';
import {User} from '../UserClass';

@Component({
  selector: 'app-user-authorized-page',
  templateUrl: './user-authorized-page.component.html',
  styleUrls: ['./user-authorized-page.component.less']
})
export class UserAuthorizedPageComponent implements OnInit, DoCheck {
  constructor(public articleService: ArticleService, public router: Router, public activatedRoute: ActivatedRoute,
              public userService: UsersService) {
  }
  read_article = 0;
  update = 0;
  name_for_read: string;
  back_color = '#0e60a1';
  select_button_index = -1;
  background_menu_array: string[] = [];
  loginUser: string;
  emailUser: string;
  article_Name: ArticleName[] = [];
  access_suggest: string;
  scope_read_boolean = false;
  scope_comment_boolean = false;
  scope_read_boolean__item = false;
  scope_comment_boolean__item = false;
  ngOnInit(): void {
    // console.log(1000);
    this.userService.Load_access_suggest_by_login(this.loginUser);
    this.activatedRoute.params.subscribe((params: Params) => {
       this.loginUser = params['login'];
    });
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login = '';
    if (currentUser) {
      login = currentUser.login;
     // console.log(currentUser);
      this.emailUser = currentUser.email;
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
    // console.log(1);
    if (this.articleService.articles_choosen_names && this.update) {
      this.update = 0;
      // console.log(100);
      this.userService.Load_access_suggest_by_login(this.loginUser);
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
  change_back_info(index: number): void {
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

  choose_articles(name: string): void {
    this.update = 1;
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
      // console.log(1);
      const tmpEmails = articleName.access_read.split(' ');
      for (let i = 0 ; i < tmpEmails.length; i++) {
        // console.log(tmpEmails[i]);
        // console.log(this.emailUser);
        if (tmpEmails[i] === this.emailUser) {
          return 1;
        }
      }
    }
    // console.log(3);
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
