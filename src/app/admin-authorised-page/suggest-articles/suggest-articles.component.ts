import {ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';
import {ArticleTopic} from '../../article.service';
import {ArticleName} from '../../article.service';
import {Article} from '../../article.service';
import {ArticleService} from '../../article.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';
import Backendless from 'backendless';
import {User} from '../../UserClass';


@Component({
  selector: 'app-suggest-articles',
  templateUrl: './suggest-articles.component.html',
  styleUrls: ['./suggest-articles.component.less']
})
export class SuggestArticlesComponent implements OnInit, DoCheck {
  login: '';
  Article_tmp: ArticleName;
  time_update = 1;
  busy = 0;
  constructor(public articleService: ArticleService, public router: Router, public changeDetectorRef: ChangeDetectorRef) { }

  public suggest_names: ArticleName[] = [];

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.login = (JSON.parse(localStorage.getItem('currentUser'))).login;
    }
    this.Load_Suggest_Name();
    this.articleService.Load_all_names_topic();
  }
  ngDoCheck(): void {
    /*if (this.time_update && !this.busy) {
        // this.Load_Suggest_Name();
      this.time_update = 0;
       this.articleService.Load_all_names_topic().then(() => {
         this.Load_Suggest_Name();
         this.time_update = 1;
       });
    }*/
  }
  Load_Suggest_Name(): void {
    let k = 0;
    let flag = 0;
    for (let i = 0; i < this.articleService.article_names.length; i++) {
      if (this.articleService.article_names[i].confirmation === 0) {
        for (let j = 0; j < this.articleService.topics.length; j++) {
          if (this.articleService.article_names[i].topic === this.articleService.topics[j].topic) {
            flag = 1;
            break;
          }
        }
        if (flag !== 1 ) {
          this.suggest_names[k] = this.articleService.article_names[i];
          if (i + 1 !== this.articleService.article_names.length) {
            k++;
          }
        } else {
          flag = 0;
        }
      }
    }
    this.changeDetectorRef.detectChanges();
  }
  close_suggest(): void {
    this.router.navigate(['admin', this.login]);
  }
  get_backround_row(index: number): string {
    if (index % 2 === 0) {
      return '';
    } else {
      return '#f3d6ff';
    }
  }
  choose_articles(name: string): void {
    this.articleService.Load_article_for_read(name);
  }
  Delete_article(article_name: string): void {
    this.busy = 1;
    this.articleService.Delete_article(article_name).then( () => {
     // console.log(1);
      this.Delete_suggest_article_in_local_array(article_name);
      this.articleService.Load_all_names_topic();
      this.changeDetectorRef.detectChanges();
    });
  }
  Delete_suggest_article_in_local_array(article_name: string): void {
    const tmpArticleTopic: ArticleName[] = [];
    let k = 0;
    // console.log(article_name);
    for (let i = 0; i < this.suggest_names.length; i++) {
      if (this.suggest_names[i].name !== article_name) {
        tmpArticleTopic[k] = this.suggest_names[i];
        if (this.suggest_names.length !== i + 1 ) {
          k++;
        }
      }
    }
    this.suggest_names = [];
    // console.log(this.suggest_names);
    if (tmpArticleTopic.length) {
      this.suggest_names = tmpArticleTopic;
    } else {
      this.suggest_names.splice(0, this.suggest_names.length - 1); // = 0;
      while ( this.suggest_names.length > 0) {
       //  console.log(this.suggest_names.length);
        this.suggest_names.pop();
      }
      // console.log(this.suggest_names);
      this.suggest_names.length = 0;
      // console.log(this.suggest_names.length);

    }

  }
  Accept_article(suggestName: string): void {
    this.busy = 1;
   // this.time_update = 0
    this.articleService.Load_article_Name_for_read(suggestName).then(
      () => {
        this.Article_tmp = this.articleService.article_read_name;
        this.Article_tmp.confirmation = 1;
        this.articleService.Update_article_name(this.Article_tmp).then(
          () => {
          this.Load_Suggest_Name();
        this.articleService.Load_all_names_topic();
          }
        );
        const topic = new ArticleTopic(this.Article_tmp.id, this.Article_tmp.topic);
        this.articleService.Add_article_topic(topic);
        this.Delete_suggest_article_in_local_array(suggestName);
        // this.changeDetectorRef.detectChanges();
        // this.close_suggest();
          }
        );
  }

}
