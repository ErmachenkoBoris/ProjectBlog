import {Component, DoCheck, Input, OnChanges, OnInit} from '@angular/core';
import {Article, ArticleName} from '../../article.service';
import {ArticleService} from '../../article.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import {Comment} from '../../comment.service';
import {CommentService} from '../../comment.service';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-reading-article',
  templateUrl: './reading-article.component.html',
  styleUrls: ['./reading-article.component.less']
})
export class ReadingArticleComponent implements OnInit, DoCheck, OnChanges {
  @Input() article_name = '';
  login: string;
  email: string;
  comment_text = '';
  article_old: string;
  article_names: ArticleName[];
  access_write: string;
  public article: Article = new Article('', '', -1, '', '');

  constructor(public articleService: ArticleService, private activatedRoute: ActivatedRoute,
              public router: Router, private location: Location, public commentService: CommentService,
              public userService: UsersService) {
    this.article = new Article('', '', -1, '', '');
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.access_write = currentUser.access_write;
      this.login = currentUser.login;
      this.email = currentUser.email;
      // console.log(this.login);

      this.userService.Load_access_comment_by_login(this.login);
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.article_name = params['nameArticle'];
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
  ngOnChanges(): void {
    // console.log(5);
  }

  ngDoCheck(): void { // не нужен нафиг
    // console.log(2);
    // this.userService.Load_access_comment_by_login(this.login);
    if (this.article_name !== this.article_old) {
     // console.log(1);
      this.userService.Load_access_comment_by_login(this.login);
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
    /*const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login = '';
    if (currentUser) {
      login = currentUser.login;
      console.log(currentUser);
    }
    */
    this.commentService.Load_count_comment();
    const newComment = new Comment(this.commentService.last_comment_id + 1, this.article_name, this.comment_text, this.login);
    this.commentService.add_comment(newComment);
    this.comment_text = '';
    this.commentService.Load_count_comment();
    return null;
  }
  access_comment(article: Article): number {
    if (article.access_comment === 'all') {
      return 1;
    } else {
      const tmpEmails = article.access_comment.split(' ');
      // console.log(this.email);
      for (let i = 0 ; i < tmpEmails.length; i++) {
        if (tmpEmails[i] === this.email) {
          // console.log('s');
          return 1;
        }
      }
    }
    // console.log('ss');
    return 0;
  }
}
