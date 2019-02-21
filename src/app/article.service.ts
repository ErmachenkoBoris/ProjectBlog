import {DoCheck, Injectable, OnInit} from '@angular/core';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';
import {User} from './users.service';

export class Article {
  public name: string;
  public article: string;
  public author: string;
  public id: number;
  public topic: string;
  constructor(article: string, author: string, id: number, topic: string, name: string) {
    this.article = article;
    this.author = author;
    this.id = id;
    this.topic = topic;
    this.name = name;
  }
}

export class ArticleTopic {
  public id: number;
  public topic: string;
  constructor(id: number, topic: string) {
    this.id = id;
    this.topic = topic;
  }
}

export class ArticleName {
  public confirmation: number;
  public id: number;
  public name: string;
  public topic: string;
  constructor(
    confirmation: number,
  id: number,
  name: string,
  topic: string
  ) {
  this.confirmation = confirmation;
  this.id = id;
  this.name = name;
  this.topic = topic;
  }
}


const ArticlesStore = Backendless.Data.of('article_data');
const TopicsStore = Backendless.Data.of('article_topic');

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  public names_count = 0;
  public articles: Article[] = [];
  public articles_choosen: Article[] = [];
  public articles_choosen_names: ArticleName[] = [];
  public article_read: Article = new Article('', '', 1, '', '');
  public topics: ArticleTopic[] = [];
  public article_names: ArticleName[] = [];
  public email_found = 0;
constructor() {
    this.Load_count_names();
    console.log(1);
  }

  Load_all_articles() {
    ArticlesStore.find<Article>().then((articles: Article[]) => {
      this.articles = articles;
    });
  }
  Load_all_topics() {
    TopicsStore.find<ArticleTopic>().then((topics: ArticleTopic[]) => {
      this.topics = topics;
    });
  }
  Search_email(email: string): Observable<ValidationErrors> {
    const whereClause = `email = '${email}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(function( foundContacts ) {
          if (foundContacts.length !== 0) {
            observer.next({
              userExist: 'user exist'
            });
            observer.complete();
          } else {
            observer.next(null);
          }
        }
      ).catch(function( fault ) {
        observer.complete();
      });
    });
  }

  Search_name_article(name: string): Observable<ValidationErrors> {
    const whereClause = `name = '${name}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'article_name' ).find( queryBuilder ).then(function( foundNames ) {
          if (foundNames.length !== 0) {
            observer.next({
              nameExist: 'name exist'
            });
            observer.complete();
          } else {
            observer.next(null);
          }
        }
      ).catch(function( fault ) {
        observer.complete();
      });
    });
  }
  Load_choose_Articles (topicArticle: string): any {
    const whereClause = `topic = '${topicArticle}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    Backendless.Data.of( 'article_data' ).find( queryBuilder )
      .then( ( foundArticles: Article[] ) => {
        this.articles_choosen = foundArticles;
        console.log(this.articles_choosen);
      })
      .catch( function( fault ) {
        console.log(fault);
        return null;
      });

  }
  Load_choose_Articles_names (topicArticle: string): any {
    const whereClause = `topic = '${topicArticle}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    Backendless.Data.of( 'article_name' ).find( queryBuilder )
      .then( ( foundArticles: ArticleName[] ) => {
        this.articles_choosen_names = foundArticles;
        console.log(this.articles_choosen_names);
      })
      .catch( function( fault ) {
        console.log(fault);
        return null;
      });
    this.Load_count_names ();
  }

  Load_count_names (): any {
    const dataQueryBuilder = Backendless.DataQueryBuilder.create().setProperties( 'Count(objectId)');
    Backendless.Data.of( 'article_name' ).find( dataQueryBuilder )
      .then( ( result: {
        'count': number,
        '___class': 'any',
      } []) => {
          this.names_count = result[0].count;
          console.log(this.names_count);
      } );

  }

  Load_article_for_read(name_Article: string): any {
    const whereClause = `name = '${name_Article}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    Backendless.Data.of( 'article_data' ).find( queryBuilder )
      .then( ( foundArticles: Article[] ) => {
        this.article_read = foundArticles[0];
      })
      .catch( function( fault ) {
        console.log(fault);
        return null;
      });

  }
  Add_Article(article: Article): Promise<void> {
    this.names_count++;
    return Backendless.Data.of( 'article_data' ).save<Article>(article).then((savedArticle: Article) => {
      this.articles.push(savedArticle);
    });
  }
  Add_article_topic(topic: ArticleTopic): Promise<void> {
    return Backendless.Data.of( 'article_topic' ).save<ArticleTopic>(topic).then((savedArticleTopic: ArticleTopic) => {
      this.topics.push(savedArticleTopic);
    });
  }
  Add_article_name(name: ArticleName): Promise<void> {
  console.log(111);
    return Backendless.Data.of( 'article_name' ).save<ArticleName>(name).then((savedArticleName: ArticleName) => {
      this.article_names.push(savedArticleName);
    });
  }
 /* Add_user(user: User): Promise<void> {
    return UsersStore.save<User>(user).then((savedUser: User) => {
      this.users.push(savedUser);
    });
  }
  Get_users_count(): number {
    return this.users.length;
  }*/
}
