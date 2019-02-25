import { Injectable } from '@angular/core';
import {User} from './users.service';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';


const CommentsStore = Backendless.Data.of('comment_data');
const PAGE_SIZE = 50;
export class Comment {
  id: number;
  article: string;
  text: string;
  author: string;
  constructor(  id: number, article: string,
  text: string,
  author: string) {
    this.id = id;
    this.article = article;
    this.text = text;
    this.author = author;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor() { }
  public comments: Comment[] = [];
  public last_comment_id = 0;
  get_comments_by_article(article: string) {
    const whereClause = `article = '${article}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    CommentsStore.find( queryBuilder ).then(( foundComments: Comment[] ) => {
          if (foundComments.length !== 0) {
            this.comments = foundComments;
            } else {
            this.comments = [];
          }
        }
      ).catch(function( fault ) {
      });
    }
  add_comment(comment: Comment): Promise<void> {
    return CommentsStore.save<Comment>(comment).then((savedComment: Comment) => {
      this.comments.push(savedComment);
    });
  }
  Load_count_comment (): any {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy( ['id'] );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    Backendless.Data.of( 'comment_data' ).find(queryBuilder)
      .then( ( lastObject: any[] ) => {
        this.last_comment_id = lastObject[lastObject.length - 1].id;
      })
      .catch( function( error ) {
        // an error has occurred, the error code can be retrieved with fault.statusCode
      });

  }
}
