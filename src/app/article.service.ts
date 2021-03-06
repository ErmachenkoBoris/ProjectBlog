import {Injectable} from '@angular/core';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';
import {User} from './UserClass';

class Res {
  access: '';
  article: '';
  author: '';
  created: 0;
  id: 0;
  name: '';
  objectId: '';
  ownerId: null;
  topic: '';
  updated: null;
  ___class: '';
}

export class Article {
  public name: string;
  public article: string;
  public author: string;
  public id: number;
  public topic: string;
  public access_read: string;
  public access_comment: string;
  constructor(article: string, author: string, id: number, topic: string, name: string, access_read: string = 'all',
              access_comment: string = 'all') {
    this.article = article;
    this.author = author;
    this.id = id;
    this.topic = topic;
    this.name = name;
    this.access_read = access_read;
    this.access_comment = access_comment;
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
  public author: string;
  public confirmation: number;
  public id: number;
  public name: string;
  public topic: string;
  public access_read: string;
  public access_comment: string;
  constructor(
    author: string,
    confirmation: number,
    id: number,
    name: string,
    topic: string,
    access_read: string = 'all',
    access_comment: string = 'all'
  ) {
    this.author = author;
  this.confirmation = confirmation;
  this.id = id;
  this.name = name;
  this.topic = topic;
  this.access_read = access_read;
  this.access_comment = access_comment;
  }
}

const PAGE_SIZE = 50;
const ArticlesStore = Backendless.Data.of('article_data');
const TopicsStore = Backendless.Data.of('article_topic');

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  result_data: any = new Res();
  result_name: any = new Res();
  public names_count = 0;
  public articles: Article[] = [];
  public articles_choosen: Article[] = [];
  public articles_choosen_names: ArticleName[] = [];
  public article_read: Article = new Article('', '', 1, '', '');
  public topics: ArticleTopic[] = [];
  public article_names: ArticleName[] = [];
  // public email_found = 0;
  article_read_name: ArticleName;
constructor() {
    this.Load_count_names();
    this.Load_all_names_topic();
  }

  Load_all_articles(): void {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize( 50 ).setOffset( 0 ).setSortBy( ['id'] );
    ArticlesStore.find<Article>(queryBuilder).then((articles: Article[]) => {
      this.articles = articles;
    });
  }
  Load_all_names_topic(): Promise<void> {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize( 50 ).setOffset( 0 ).setSortBy( ['id'] );
    return new Promise<void>( (ok) => {
      Backendless.Data.of('article_name').find<any>(queryBuilder).then((articleName) => {
        this.article_names = articleName;
        ok();
      });
    });
  }
  Load_all_topics(): void {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize( 50 ).setOffset( 0 ).setSortBy( ['id'] );
    TopicsStore.find<ArticleTopic>(queryBuilder).then((topics: ArticleTopic[]) => {
      this.topics = topics;
    });
  }
  /*
  Search_email(email: string): Observable<ValidationErrors> {
    const whereClause = `email = '${email}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
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
*/
  Search_name_article(name: string): Observable<ValidationErrors> {
    const whereClause = `name = '${name}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
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
  /*
  Load_choose_Articles (topicArticle: string): any {
    const whereClause = `topic = '${topicArticle}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    Backendless.Data.of( 'article_data' ).find( queryBuilder )
      .then( ( foundArticles: Article[] ) => {
        this.articles_choosen = foundArticles;
      })
      .catch( function( fault ) {
        return null;
      });

  }*/
  Load_choose_Articles_names (topicArticle: string): Promise<void> {
    const whereClause = `topic = '${topicArticle}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return new Promise<void>((ok) => {
      Backendless.Data.of('article_name').find(queryBuilder)
        .then((foundArticles: ArticleName[]) => {
          this.articles_choosen_names = foundArticles;
          ok();
        })
        .catch(function (fault) {
          return null;
        });
      this.Load_count_names();
    });
  }

  Load_count_names (): any {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    Backendless.Data.of( 'article_name' ).findLast(queryBuilder)
      .then( ( lastObject: User ) => {
        this.names_count = lastObject.id;
      })
      .catch( function( error ) {
      });

  }


  Load_article_for_read(name_Article: string): Promise<void> {
    const whereClause = `name = '${name_Article}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return Backendless.Data.of( 'article_data' ).find( queryBuilder )
      .then( ( foundArticles: Article[] ) => {
        this.article_read = foundArticles[0];
      })
      .catch( function( fault ) {
        return null;
      });
  }
  Load_article_Name_for_read(name_Article: string): Promise<void> {
    const whereClause = `name = '${name_Article}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return Backendless.Data.of( 'article_name' ).find( queryBuilder )
      .then( ( foundArticles: ArticleName[] ) => {
        this.article_read_name = foundArticles[0];
      })
      .catch( function( fault ) {
        return null;
      });
  }
  Add_Article(article: Article): Promise<void> {
    this.names_count++;
    return new Promise<void> ( (ok) => {
      Backendless.Data.of( 'article_data' ).save<Article>(article).then((savedArticle: Article) => {
        this.articles.push(savedArticle);
        ok();
      });
    });
  }
  /*Update_Article(article: Article): Promise<void> {
    this.names_count++;
    return Backendless.Data.of( 'article_data' ).save<Article>(article).then((savedArticle: Article) => {
      this.articles.push(savedArticle);
    });
  }*/
  Add_article_topic(topic: ArticleTopic): Promise<void> {
    return new Promise<void>( (ok) => {
      Backendless.Data.of( 'article_topic' ).save<ArticleTopic>(topic).then((savedArticleTopic: ArticleTopic) => {
      this.topics.push(savedArticleTopic);
      ok();
    });
  });
  }
  Add_article_name(name: ArticleName): Promise<void> {
    return Backendless.Data.of( 'article_name' ).save<ArticleName>(name).then((savedArticleName: ArticleName) => {
      this.article_names.push(savedArticleName);
      this.Load_all_names_topic();
    });
  }
  Update_article_name(name: ArticleName): Promise<void> {
    return Backendless.Data.of( 'article_name' ).save<ArticleName>(name).then((savedArticleName: ArticleName) => {
      // this.Update_array_article_names(name);
      this.Update_array_article_names(name);
      this.Load_all_names_topic();
    });
  }
  Delete_article(article: string): Promise<void> {
    const whereClause = `name = '${article}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return new Promise<void>( ok => {
      Backendless.Data.of('article_data').find(queryBuilder)
        .then((foundArticle: Res[]) => {
          this.result_data = foundArticle[0].objectId; // можно и без него обойтись
          Backendless.Data.of('article_data').remove(foundArticle[0])
            .then(function (timestamp) {
              // this.Load_all_names_topic();
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (fault) {
        });
      Backendless.Data.of('article_name').find(queryBuilder)
        .then((foundArticles: Res[]) => {
          this.result_name = foundArticles[0].objectId; // можно и без него обойтись
          Backendless.Data.of('article_name').remove(foundArticles[0])
            .then((timestamp) => {
              this.Load_all_names_topic();
              ok(); // !!!!!
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (fault) {
        });
    });
  }
  Delete_article_name(article: string): Promise<void> {
    const whereClause = `name = '${article}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return Backendless.Data.of( 'article_name').find( queryBuilder )
      .then( ( foundArticles: Res[] ) => {
        this.result_name = foundArticles[0].objectId;
        Backendless.Data.of('article_name').remove(foundArticles[0])
          .then((timestamp) => {
            this.Load_all_names_topic();
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch( function( fault ) {
      });
  }
  Delete_topic(topic: string): Promise<void> {
    const whereClause = `topic = '${topic}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return Backendless.Data.of( 'article_topic').find( queryBuilder )
      .then( ( foundArticles: Res[] ) => {
        this.result_name = foundArticles[0].objectId;
        Backendless.Data.of('article_topic').remove(foundArticles[0])
          .then((timestamp) => {
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch( function( fault ) {
      });
  }
  Delete_all_article_for_topic(topic: string): void {
    const whereClause = `topic = '${topic}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    Backendless.Data.of( 'article_data' ).find( queryBuilder )
      .then( ( foundArticle: Res[] ) => {
        for (let i = 0; i < foundArticle.length; i++) {
          Backendless.Data.of('article_data').remove(foundArticle[i])
            .then(function (timestamp) {
              // this.Load_all_names_topic();
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch( function( fault ) {
      });
    Backendless.Data.of( 'article_name').find( queryBuilder )
      .then( ( foundArticles: Res[] ) => {
        for (let i = 0; i < foundArticles.length; i++) {
          Backendless.Data.of('article_name').remove(foundArticles[i])
            .then((timestamp) => {
              this.Load_all_names_topic();
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch( function( fault ) {
      });
  }
  Update_array_article_names(name: ArticleName): void {
    for (let i = 0; i < this.article_names.length; i++) {
        if (this.article_names[i].name === name.name) {
          this.article_names[i] = name;
          break;
        }
    }
  }
}

