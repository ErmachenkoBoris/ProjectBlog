import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ValidationErrors} from '@angular/forms';
import {UsersService, User} from '../../../users.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {
  public _location: Location;
  add_user_form: FormGroup;
  difficult_password = 0;
  login: string;

  constructor(private fb: FormBuilder, private usersService: UsersService,
              private router: Router, public userService: UsersService) {
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      this.login = (JSON.parse(localStorage.getItem('currentUser'))).login;
    }
    this._location = this.userService.location;
    this.InitForm();
    this.usersService.Get_users_count();
  }

  InitForm(): void {
    this.add_user_form = this.fb.group({
      admin: [, [Validators.pattern(/^[0-9]+$/u)]],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/u)]],
      surname: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/u)]],
      login: ['', [Validators.required, Validators.pattern(/^[A-z0-9]+$/u)], [(control: AbstractControl):
        Observable<ValidationErrors | null> =>
        this.Login_validator(control)]],
      email: ['', [Validators.required, Validators.email], [(control: AbstractControl): Observable<ValidationErrors | null> =>
        this.Email_validator(control)]],
      password: ['', [Validators.required, this.passwordValidator]],
      password_check: ['', [Validators.required, this.Check_password_validator]]
    });
  }

  Is_controle_invalid(name_controle: string): boolean {
    const contol = this.add_user_form.controls[name_controle];
    return contol.invalid && contol.touched;
  }

  Is_controle_invalid_full(name_controle: string): boolean {
    const contol = this.add_user_form.controls[name_controle];
    return contol.invalid;
  }

  private passwordValidator = (control: FormControl): any => {
    if (this.add_user_form) {
      let difficult_p = 0;
      const value = control.value;

      const hasNumber = /[0-9]/.test(value);

      const hasCapitalLetter = /[A-Z]/.test(value);

      const hasLowercaseLetter = /[a-z]/.test(value);

      const isLengthValid = value ? value.length > 7 : false;
      for (let i = 1; i < value.toLocaleString().length - 1; i++) {
        if (value[i] === value[i - 1] && value[i - 1] === value[i + 1]) {
          difficult_p = -1;
        }
        if (value[i] - value[i - 1] === value[i + 1] - value[i]) {
          difficult_p = -1;
        }
      }
      let passwordValid = hasCapitalLetter && hasLowercaseLetter && hasNumber;
      if (!passwordValid) {
        this.difficult_password = 0;
        return {
          invalidPassword: 'eng lowercase uppercase, numbers'
        };
      }
      passwordValid = isLengthValid && passwordValid;
      if (!passwordValid) {
        this.difficult_password = 0;
        return {invalidPassword: 'too short'};
      }
      if (difficult_p === -1) {
        this.difficult_password = 1;
      } else {
        this.difficult_password = 2;
      }
      return null;
    }
  }
  Check_password_validator = (control: FormControl): any => {
    if (this.add_user_form) {
      const value = control.value;
      const value_password = this.add_user_form.value.password;

      if (value_password !== value) {
        return {invalidPassword: 'passwords do not match'};
      }
      return null;
    }
  }

  Get_password_error(control_name: string): string {
    if (this.add_user_form.get(control_name).getError('invalidPassword') && this.add_user_form.get(control_name).touched) {
      return this.add_user_form.get(control_name).getError('invalidPassword');
    } else {
      return null;
    }
  }

  public Email_validator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usersService.Search_email(control.value).pipe(map(response => {
      if (response) {
        if (response.length !== 1) {
          return {emailExist: 'email is used'};
        } else {
          return null;
        }
      } else {
        return null;
      }
    }));
  }

  public Login_validator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usersService.Search_login(control.value).pipe(map(response => {
      if (response) {
        if (response.length !== 1) {
          return {loginExist: 'login is already taken'};
        } else {
          return null;
        }
      } else {
        return null;
      }
    }));
  }

  Submit_form_register(): any {
      const controls = this.add_user_form.controls;
      for (const key in controls) {
        if (this.Is_controle_invalid(key)) {
          return null;
        }
      }
    for (const key in controls) {
      if (this.Is_controle_invalid_full(key)) {
        return null;
      }
    }
      const count = this.usersService.users_count + 1;
      let admin = 0;
      if (this.add_user_form.value.admin === '1') {
        admin = 1;
      }
      const user = new User(
        admin,
        this.add_user_form.value.email,
        count,
        this.add_user_form.value.login,
        this.add_user_form.value.name,
        this.add_user_form.value.password,
        this.add_user_form.value.surname);
      const error = this.usersService.Add_user(user);
      this.close_add_form();
  }

  Check_all_validators(): number {
    const controls = this.add_user_form.controls;
    for (const cont in controls) {
      if (this.Is_controle_invalid_full(cont)) {
        return 0;
      }
    }
    return 1;
  }
  close_add_form(): void {
    console.log(this.router.url);
    this.router.navigate(['admin', this.login, { outlets: { control_user: ['control']}}]);

  }
}

