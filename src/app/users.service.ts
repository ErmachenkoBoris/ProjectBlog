import {DoCheck, Injectable, OnInit} from '@angular/core';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';
import {Location} from '@angular/common';
import {Article} from './article.service';
import {promise} from 'selenium-webdriver';

class Res {
  admin: 0;
  created: 0;
  email: '';
  id: 0;
  login: '';
  name: '';
  objectId: '';
  ownerId: null;
  password: '';
  surname: '';
  updated: 0;
  ___class: '';
}

export class User {
  public access_suggest: string;
  public access_write: string;
  public admin: number;
  public email: string;
  public id: number;
  public login: string;
  public name: string;
  public password: string;
  public surname: string;
  public user_for_access: User;
  constructor(admin: number, email: string, id: number, login: string, name: string, password: string, surname: string,
              access_write: string = '1', access_suggest: string = '1') {
  this.admin = admin;
  this.email = email;
  this.id = id;
  this.login = login;
  this.name = name;
  this.password = password;
  this.surname = surname;
  this.access_suggest = access_suggest;
  this.access_write = access_write;
  }
}

const UsersStore = Backendless.Data.of('user_data');
const PAGE_SIZE = 50;
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public location: Location;
  public users_count = 0;
  public admin = 0;
  public users: User[] = [];
  public email_found = 0;
  public user_for_access: User;
  Load_All_users(): void {
   const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy( ['id'] ).setPageSize( PAGE_SIZE ).setOffset( 0 );
    UsersStore.find<User>(queryBuilder).then((users: User[]) => {
      this.users = users;
    });
  }
  Search_email(email: string): Observable<ValidationErrors> {
    const whereClause = `email = '${email}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(function( foundEmail ) {
          if (foundEmail.length !== 0) {
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

  Search_login(login: string): Observable<ValidationErrors> {
    const whereClause = `login = '${login}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(( foundLogins: User[] ) => {
          if (foundLogins.length !== 0) {
            this.admin = foundLogins[0].admin;
            observer.next(
              {
              loginExist: 'login exist'
            });
            observer.complete();
          } else {
            observer.next(null);
            observer.complete();
          }
        }
      ).catch(function( fault ) {
        observer.complete();
      });
    });
  }

  Search_user_by_login_and_password(login: string, password: string): Observable<ValidationErrors> {
    const whereClause = `login = '${login}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(( foundLogins: User[] ) => {
          if (foundLogins.length !== 0) {
            if (foundLogins[0].password !== password) {
              observer.next({
                WrongData: 'password incorrect'
              });
              observer.complete();
            } else {
              localStorage.setItem('currentUser', JSON.stringify({ login: foundLogins[0].login, email: foundLogins[0].email,
              access_write: foundLogins[0].access_write, access_suggest: foundLogins[0].access_suggest}));
              observer.next(null);
            }
          } else {
            observer.next({
              WrongData: 'login incorrect'
            });
            observer.complete();
          }
        }
      ).catch(function( fault ) {
        observer.complete();
      });
    });
  }
  Add_user(user: User): Promise<void> {
    return Backendless.Data.of('user_data').save<User>(user).then((savedUser: User) => {
      this.users.push(savedUser);
    }).catch((error) => {
    });
  }
  Update_user(user: User): Promise<void> {
    return Backendless.Data.of('user_data').save<User>(user).then((savedUser: User) => {
      this.update_users(user);
    }).catch((error) => {
    });
  }
  Get_users_count(): void {
    this.Load_count_names();
  }
  Load_count_names (): any {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy( ['id'] );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    Backendless.Data.of( 'user_data' ).find(queryBuilder)
      .then( ( lastObject: any[]) => {
        this.users_count = lastObject[lastObject.length - 1].id;
      })
      .catch( function( error ) {
        // an error has occurred, the error code can be retrieved with fault.statusCode
      });

  }
  Delete_user(login: string): Promise<void> {
    const whereClause = `login = '${login}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return Backendless.Data.of( 'user_data' ).find( queryBuilder )
      .then( ( foundUser: Res[] ) => {
        Backendless.Data.of('user_data').remove(foundUser[0])
          .then(() => {
            this.Delete_user_in_array(foundUser[0].login);
          })
          .catch(function (error) {
          });
      })
      .catch( function( fault ) {
      });

  }
  Delete_user_in_array(login: string): void {
    let k = 0 ;
    const usersTmp: User[] = [];
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].login !== login) {
        usersTmp[k] = this.users[i];
      }
      if ( (i + 1) !== this.users.length) {
        k++;
      }
    }
    this.users = [];
    for (let i = 0; i < usersTmp.length; i++) {
      this.users[i] = usersTmp[i];
    }
  }
  Send_emails(subject: string, text: string, recipients: string[]): void {
    const bodyParts = new Backendless.Bodyparts();
    bodyParts.textmessage = text;
    bodyParts.htmlmessage = text;
    Backendless.Messaging.sendEmail( subject,
      bodyParts, recipients)
      .then( function( response ) {
      })
      .catch( function( error ) {
        console.log( 'error' + error.message );
      });

  }
  Load_user_by_login(login: string): Promise<void> {
    const whereClause = `login = '${login}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    queryBuilder.setPageSize( PAGE_SIZE ).setOffset( 0 );
    return Backendless.Data.of( 'user_data' ).find( queryBuilder )
      .then( ( foundUsers: User[] ) => {
        this.user_for_access = foundUsers[0];
      })
      .catch( function( fault ) {
        return null;
      });
  }
  update_users(user: User): number {
    for ( let i = 0; i < this.users.length; i++) {
      if (this.users[i].login === user.login) {
        this.users[i] = user;
        return 1;
      }
    }
    return 0;
  }
}
