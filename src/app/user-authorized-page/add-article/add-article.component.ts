import {Component, DoCheck, OnInit} from '@angular/core';
import {Article, ArticleName, ArticleService, ArticleTopic} from '../../article.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Location} from '@angular/common';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.less']
})
export class AddArticleComponent implements OnInit, DoCheck {
  topic: string;
  add_form: FormGroup;
  suggest = 0;
  currentUser: any;
  scope_comment = '';
  scope_read = '';
  scope_read_boolean = false;
  scope_comment_boolean = false;
  scope_read_boolean__item = false;
  scope_comment_boolean__item = false;
  email_current_user = '';
  login = '';
  constructor(public articleService: ArticleService, private activatedRoute: ActivatedRoute,
              public router: Router, public fb: FormBuilder, private location: Location, private userService: UsersService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.login = this.currentUser.login;
      this.email_current_user = this.currentUser.email;
    }
    this.InitForm();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.login = this.currentUser.login;
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.topic = params['nameTopic'];
      if (this.topic === '') {
        this.suggest = 1;
      }
    });
    this.userService.Load_access_suggest_by_login(this.login);
    // console.log(this.userService.access_suugest);
    // if (this.userService.access_suugest === '0') {
      // this.router.navigate(['']);
    // }
  }
  ngDoCheck(): void {
    // console.log(this.userService.access_suugest);
    if (this.userService.access_suugest === '0') {
      // console.log();
      this.router.navigate(['']);
    }
  }
  InitForm(): void {
    this.add_form = this.fb.group({
      name_topic: ['', [Validators.required, Validators.pattern(/^[A-z0-9]+$/u)]],
      name_article: ['', [Validators.required, Validators.pattern(/^[A-z0-9]+$/u)],
        [(control: AbstractControl): Observable<ValidationErrors | null> =>
        this.Name_article_validator(control)]],
      text: ['', [Validators.required]],
      scope_read : [''],
      scope_comment: ['']
    });
  }
  Submit_add_form(): number {
    if (this.scope_read_boolean) {
      this.add_form.value.scope_read = this.add_form.value.scope_read  + ' ' + this.email_current_user;
    } else {
      this.add_form.value.scope_read = 'all';
    }
    if (this.scope_comment_boolean) {
      this.add_form.value.scope_comment = this.add_form.value.scope_comment  + ' ' + this.email_current_user;
    } else {
      this.add_form.value.scope_comment = 'all';
    }
    const control = this.add_form.controls;
    for (const key in control) {
      if (key !== 'name_topic') {
        if (this.Is_controle_invalid_full(key)) {
          return 0;
        }

      }
    }
    const id = this.articleService.names_count + 1;
    const newArticle = new Article(
      this.add_form.value.text,
      this.login,
      id,
      this.add_form.value.name_topic || this.topic,
      this.add_form.value.name_article,
      this.add_form.value.scope_read,
      this.add_form.value.scope_comment
    );
    let conf = 1;
      if (this.suggest === 1) {
      conf = 0;
    }
    const promiseArticle = this.articleService.Add_Article(newArticle);
    const newArticle_name = new ArticleName(
      this.login,
      conf,
      id,
      this.add_form.value.name_article,
      this.add_form.value.name_topic || this.topic,
      this.add_form.value.scope_read,
      this.add_form.value.scope_comment
    );
    const promiseArticle_name = this.articleService.Add_article_name(newArticle_name);
    // if (promiseArticle && promiseArticle_name) {
     // this.location.back();
    // }
    promiseArticle.then(() => {
      promiseArticle_name.then(() => {
        // console.log(1);
        this.location.back();
      });
    });
    return 1;
  }
  Close_add_form(): void {
    this.location.back();
  }
  Is_controle_invalid(name_controle: string): boolean {
    const contol = this.add_form.controls[name_controle];
    return contol.invalid && contol.touched;
  }
  Is_controle_invalid_full(name_controle: string): boolean {
    const contol = this.add_form.controls[name_controle];
    return contol.invalid;
  }
  Return_suggest(): number {
    return this.suggest;
  }
  public Name_article_validator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.articleService.Search_name_article(control.value).pipe(map(response => {
      if (response) {
        if (response.nameExist) {
          return {nameExist: 'Article with this name is already exist'};
        } else {
          return null;
        }
      } else {
        return null;
      }
    }));
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
    // console.log(1);
    this.scope_comment_boolean__item = !this.scope_comment_boolean__item;
  }
}
