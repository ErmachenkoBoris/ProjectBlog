import { Component, OnInit } from '@angular/core';
import {Article} from '../article.service';
import {ArticleTopic} from '../article.service';
import {ArticleService} from '../article.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-admin-authorised-page',
  templateUrl: './admin-authorised-page.component.html',
  styleUrls: ['./admin-authorised-page.component.less']
})
export class AdminAuthorisedPageComponent implements OnInit {
  constructor(public articleService: ArticleService, public router: Router, public activatedRoute: ActivatedRoute) {
  }

  read_article = 0;
  name_for_read: string;
  back_color = '#0e60a1';
  select_button_index = -1;
  background_menu_array: string[] = [];
  loginUser: string;
  currentUser: any;
  ngOnInit(): void {
    this.articleService.Load_all_names_topic();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.loginUser = params['login'];
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login = '';
    if (this.currentUser) {
      login = this.currentUser.login;
    }
    if (!login || login !== this.loginUser || !this.loginUser) {
      this.router.navigate(['']);
    }
    this.articleService.Load_all_topics();
    for (let i = 0; i < this.articleService.topics.length; i++) {
      this.background_menu_array[i] = '';
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
}
