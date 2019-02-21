import {DoCheck, Injectable} from '@angular/core';
import Backendless from 'backendless';
import {Observable} from 'rxjs';
import {ValidationErrors} from '@angular/forms';

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

  public users: User[] = [];
  public email_found = 0;
  loadAll() {
    UsersStore.find<User>().then((users: User[]) => {
      this.users = users;
      console.log(this.users);
    });
  }
  Search_email(email: string): Observable<ValidationErrors> {
    const whereClause = `email = '${email}'`;
    const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
    return new Observable<ValidationErrors | null>(observer => {
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(function( foundEmail ) {
        console.log(foundEmail);
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
      Backendless.Data.of( 'user_data' ).find( queryBuilder ).then(function( foundLogins ) {
        console.log(foundLogins);
          if (foundLogins.length !== 0) {
            observer.next({
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
  Get_users_count(): number {
    return this.users.length;
  }
}
