import {Component, DoCheck, OnInit} from '@angular/core';
import {User, UsersService} from '../../users.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';
import {AddUserComponent} from './add-user/add-user.component';
import {ArticleTopic} from '../../article.service';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.less']
})
export class UserControlComponent implements OnInit, DoCheck {
  User_tmp: User;
  login = '';
  constructor(public userService: UsersService, public location: Location, public router: ActivatedRoute,
              public changeDetectorRef: ChangeDetectorRef, public routerr: Router) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.login = (JSON.parse(localStorage.getItem('currentUser'))).login;
    }
    this.userService.Load_All_users();
    this.userService.location = this.location;
  }
  ngDoCheck(): void {
   // this.userService.Load_All_users();
  }

  Close_user_control(): void {
    this.routerr.navigate(['admin', this.login]);
  }
  Delete_user(login: string): void {
    this.userService.Delete_user(login);
    this.changeDetectorRef.detectChanges();
  }
  Get_back_td(index: number): string {
    if (index % 2 === 0 ) {
      return '';
    } else {
      return '#e0f0fe';
    }
  }

  Block_suggest(login: string): void {
    this.userService.Load_user_by_login(login).then(
      () => {
        this.User_tmp = this.userService.user_for_access;
        this.User_tmp.access_suggest = '0';
        this.userService.Update_user(this.User_tmp);
        // this.userService.Add_user(this.User_tmp);
      });
    // this.userService.Load_All_users();
      }
  UnBlock_suggest(login: string): void {
    this.userService.Load_user_by_login(login).then(
      () => {
        this.User_tmp = this.userService.user_for_access;
        this.User_tmp.access_suggest ='1';
        this.userService.Update_user(this.User_tmp);
      });
    // this.userService.Load_All_users();
  }
  Block_write(login: string): void {
    this.userService.Load_user_by_login(login).then(
      () => {
        this.User_tmp = this.userService.user_for_access;
        this.User_tmp.access_write = '0';
        this.userService.Update_user(this.User_tmp);
      });
    // this.userService.Load_All_users();
  }
  UnBlock_write(login: string): void {
    this.userService.Load_user_by_login(login).then(
      () => {
        this.User_tmp = this.userService.user_for_access;
        this.User_tmp.access_write = '1';
        this.userService.Update_user(this.User_tmp);

      });
    // this.userService.Load_All_users();
  }
  get_bool(num: any): boolean {
    // console.log(num);
    if (num === '1' ) {
      return true;
    } else {
      return false;
    }
  }
  get_un_bool(num: any): boolean {
    // console.log(num);
    if (num === '1' ) {
      return false;
    } else {
      return true;
    }
  }

}
