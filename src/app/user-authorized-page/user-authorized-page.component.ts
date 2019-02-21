import { Component, OnInit } from '@angular/core';
import {Article} from '../article.service';
import {ArticleTopic} from '../article.service';
import {ArticleService} from '../article.service';

@Component({
  selector: 'app-user-authorized-page',
  templateUrl: './user-authorized-page.component.html',
  styleUrls: ['./user-authorized-page.component.less']
})
export class UserAuthorizedPageComponent implements OnInit {

  constructor(public articleService: ArticleService) {
  }

  read_article = 0;
  articles: Article[];
  name_for_read: string;
  back_color = '#0e60a1';
  select_button_index = -1;
  background_menu_array: string[] = [];
  ngOnInit() {
    this.articleService.Load_all_topics();
    for (let i = 0; i < this.articleService.topics.length; i++) {
      this.background_menu_array[i] = '';
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
    console.log(name);
    this.articleService.Load_choose_Articles_names(name);
  }

  choose_content() {
  }


  Set_name(name: string) {
    this.name_for_read = name;
  }
  select_button(index: number) {
    if (this.select_button_index !== index) {
      this.background_menu_array[this.select_button_index] = '';
      this.background_menu_array[index] = '#00daff';
      this.select_button_index = index;
    }
  }
}
