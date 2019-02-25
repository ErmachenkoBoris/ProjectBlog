import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Article} from '../../../article.service';
import {ArticleService} from '../../../article.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import {Comment} from '../../../comment.service';
import {CommentService} from '../../../comment.service';

@Component({
  selector: 'app-read-article-admin',
  templateUrl: './read-article.component.html',
  styleUrls: ['./read-article.component.less']
})
export class ReadArticleComponent implements OnInit, DoCheck {
  @Input() article_name = '';
  login: string;
  comment_text = '';
  article_old: string;
  public article: Article = new Article('', '', -1, '', '');

  constructor(public articleService: ArticleService, private activatedRoute: ActivatedRoute,
              public router: Router, private location: Location, public commentService: CommentService) {
    this.article = new Article('', '', -1, '', '');
  }

  ngOnInit(): void {
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
      this.commentService.get_comments_by_article(this.article_name);
      this.commentService.Load_count_comment();
    }
  }

  ngDoCheck(): void {
    if (this.article_name !== this.article_old) {
      this.article_old = this.article_name;
      this.articleService.Load_article_for_read(this.article_name);
      this.article = this.articleService.article_read;
      this.commentService.get_comments_by_article(this.article_name);
    }
  }
  Close_article(): void {
    this.location.back();
    // this.router.navigate([{ outlets: { article_read: null }} ]);

  }
  add_comment(): null {
    if (this.comment_text === '') { return null; }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login = '';
    if (currentUser) {
      login = currentUser.login;
    }
    this.commentService.Load_count_comment();
    const newComment = new Comment(this.commentService.last_comment_id + 1, this.article_name, this.comment_text, login);
    this.commentService.add_comment(newComment);
    this.comment_text = '';
    return null;
  }
  Delete_article(): void {
    this.articleService.Delete_article(this.article_name);
    this.Close_article();
  }
}
