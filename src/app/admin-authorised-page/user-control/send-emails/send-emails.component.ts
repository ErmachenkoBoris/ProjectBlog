import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../users.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-send-emails',
  templateUrl: './send-emails.component.html',
  styleUrls: ['./send-emails.component.less']
})
export class SendEmailsComponent implements OnInit {
  public emails: string[] = [];
  public text = '';
  public subject = '';
  public email_target = '';
  constructor(public usersService: UsersService, public location: Location) { }

  ngOnInit(): void {
    this.usersService.Load_All_users();

  }
  checkBox(): number {
    const element: any = document.querySelector('input[type=checkbox]');
    let chbox: any;
    chbox = document.getElementById('one');
    if (chbox.checked) {
      return 1;
    } else {
      return 0;
    }
  }
  send(): void {
    for (let i = 0; i < this.usersService.users.length; i++) {
      this.emails[i] = this.usersService.users[i].email;
    }
    let rec: string[] = [];
    if (this.checkBox() && this.email_target) {
      rec = this.email_target.split(' ');
      this.emails = rec;
    }
    if (this.subject && this.text && this.emails) {
      this.usersService.Send_emails(this.subject, this.text, this.emails);
      this.location.back();
    }
  }
}
