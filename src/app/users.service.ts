import {DoCheck, Injectable, OnInit} from '@angular/core';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';
import {Location} from '@angular/common';

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
  public admin: number;
  public email: string;
  public id: number;
  public login: string;
  public name: string;
  public password: string;
  public surname: string;
  constructor(admin: number, email: string, id: number, login: string, name: string, password: string, surname: string) {
  this.admin = admin;
  this.email = email;
  this.id = id;
  this.login = login;
  this.name = name;
  this.password = password;
  this.surname = surname;
  }
}

const UsersStore = Backendless.Data.of('user_data');

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public location: Location;
  public users_count = 0;
  public admin = 0;
  public users: User[] = [];
  public email_found = 0;
  Load_All_users() {
   const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy( ['id'] );
    UsersStore.find<User>(queryBuilder).then((users: User[]) => {
      this.users = users;
    });
  }
  Search_email(email: string): Observable<ValidationErrors> {
    const whereClause = `email = '${email}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
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
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(( foundLogins: User[] ) => {
          if (foundLogins.length !== 0) {
            console.log(foundLogins[0].admin);
            this.admin = foundLogins[0].admin;
            console.log(this.admin);
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
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(( foundLogins: User[] ) => {
          if (foundLogins.length !== 0) {
            if (foundLogins[0].password !== password) {
              observer.next({
                WrongData: 'password incorrect'
              });
              observer.complete();
            } else {
              localStorage.setItem('currentUser', JSON.stringify({ login: foundLogins[0].login, email: foundLogins[0].email}));
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
    return UsersStore.save<User>(user).then((savedUser: User) => {
      this.users.push(savedUser);
    });
  }
  Get_users_count() {
    this.Load_count_names();
  }
  Load_count_names (): any {
    Backendless.Data.of( 'user_data' ).findLast()
      .then( ( lastObject: User ) => {
        this.users_count = lastObject.id;
      })
      .catch( function( error ) {
        // an error has occurred, the error code can be retrieved with fault.statusCode
      });

  }
  Delete_user(login: string) {
    const whereClause = `login = '${login}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );

    Backendless.Data.of( 'user_data' ).find( queryBuilder )
      .then( ( foundUser: Res[] ) => {
        Backendless.Data.of('user_data').remove(foundUser[0])
          .then(() => {
            this.Delete_user_in_array(foundUser[0].login);
            console.log('removed OK');
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch( function( fault ) {
      });

  }
  Delete_user_in_array(login: string) {
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
  Send_emails(subject: string, text: string, recipients: string[]) {
    const bodyParts = new Backendless.Bodyparts();
    bodyParts.textmessage = text;
    bodyParts.htmlmessage = text;
    Backendless.Messaging.sendEmail( subject,
      bodyParts, recipients)
      .then( function( response ) {
        console.log( 'message has been sent' );
      })
      .catch( function( error ) {
        console.log( 'error' + error.message );
      });

  }
}
