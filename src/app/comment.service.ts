import { Injectable } from '@angular/core';
import {User} from './users.service';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';


const CommentsStore = Backendless.Data.of('comment_data');

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
    console.log(whereClause);
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    CommentsStore.find( queryBuilder ).then(( foundComments: Comment[] ) => {
          if (foundComments.length !== 0) {
            this.comments = foundComments;
            console.log(this.comments);
            } else {
            this.comments = [];
            console.log(foundComments);
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
    Backendless.Data.of( 'comment_data' ).findLast()
      .then( ( lastObject: User ) => {
        this.last_comment_id = lastObject.id;
      })
      .catch( function( error ) {
        // an error has occurred, the error code can be retrieved with fault.statusCode
      });

  }
}
