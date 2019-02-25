import { Pipe, PipeTransform } from '@angular/core';

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const login = currentUser.login;
const email = currentUser.email;

@Pipe({
  name: 'readAccess'
})
export class ReadAccessPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.scope_read === 'all') {
      return value;
    } else {
      const tmpEmails = value.scope_read.split(' ');
      for (let i = 0 ; i < tmpEmails.length; i++) {
        if (tmpEmails[i] === value.scope_read) {
          return value;
        }
      }
    }
    return null;
  }

}
