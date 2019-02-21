import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Article} from '../../article.service';
import {ArticleService} from '../../article.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reading-article',
  templateUrl: './reading-article.component.html',
  styleUrls: ['./reading-article.component.less']
})
export class ReadingArticleComponent implements OnInit, DoCheck {
  @Input() article_name = '';
  login: string
  article_old: string;
  public article: Article = new Article('', '', -1, '', '');

  constructor(public articleService: ArticleService, private activatedRoute: ActivatedRoute,
              public router: Router, private location: Location) {
    this.article = new Article('', '', -1, '', '');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.article_name = params['nameArticle'];
      this.login = params['login'];
    });
    this.article_old = this.article_name;

    if (this.article_name) {
      this.articleService.Load_article_for_read(this.article_name);
      if (this.articleService.article_read) {
        this.article = this.articleService.article_read;
      } else {
        this.article = new Article('', '', -1, '', '');
      }

    }
  }

  ngDoCheck() {
    if (this.article_name !== this.article_old) {
      this.article_old = this.article_name;
      this.articleService.Load_article_for_read(this.article_name);
      this.article = this.articleService.article_read;
    }
  }
  Close_article() {
    console.log(this.login);
      this.location.back();
      //this.router.navigate([{ outlets: { article_read: null }} ]);

  }
}
