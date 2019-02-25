import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {ArticleService} from '../../article.service';

@Component({
  selector: 'app-article-control',
  templateUrl: './article-control.component.html',
  styleUrls: ['./article-control.component.less']
})
export class ArticleControlComponent implements OnInit {
  login = '';
  constructor(public articleService: ArticleService, public location: Location, public router: ActivatedRoute,
              public changeDetectorRef: ChangeDetectorRef, public routerr: Router) { }
  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.login = (JSON.parse(localStorage.getItem('currentUser'))).login;
    }
    this.articleService.Load_all_names_topic();
  }
  Close_user_control(): void {
    this.routerr.navigate(['admin', this.login]);
  }
  Delete_article(name: string): void {
    this.articleService.Delete_article(name);
    this.changeDetectorRef.detectChanges();
  }
  Get_back_td(index: number): string {
    if (index % 2 === 0 ) {
      return '';
    } else {
      return '#e0f0fe';
    }
  }
  Delete_topic(topic: string): void {
    this.articleService.Delete_topic(topic);
    this.articleService.Delete_all_article_for_topic(topic);
}

}
