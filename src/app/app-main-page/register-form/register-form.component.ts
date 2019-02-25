import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, ValidationErrors} from '@angular/forms';
import {UsersService, User} from '../../users.service';
import {Observable} from 'rxjs';
import {AsyncValidatorFn} from '@angular/forms';
import {map} from 'rxjs/operators';
import {AbstractControl} from '@angular/forms';
import {delay} from 'rxjs/operators';
import {__values} from 'tslib';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.less']
})
export class RegisterFormComponent implements OnInit {
  register_form: FormGroup;
  difficult_password = 0;

  constructor(private fb: FormBuilder, private personsService: UsersService,
              private router: Router) {
  }

  ngOnInit() {
    this.InitForm();
    // this.personsService.load_All_users();
    this.personsService.Get_users_count();
  }

  InitForm() {
    this.register_form = this.fb.group({
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
    const contol = this.register_form.controls[name_controle];
    return contol.invalid && contol.touched;
  }

  Is_controle_invalid_full(name_controle: string): boolean {
    const contol = this.register_form.controls[name_controle];
    return contol.invalid;
  }

  private passwordValidator = (control: FormControl) => {
    if (this.register_form) {
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
    if (this.register_form) {
      const value = control.value;
      const value_password = this.register_form.value.password;

      if (value_password !== value) {
        return {invalidPassword: 'passwords do not match'};
      }
      return null;
    }
  }
  Get_password_error(control_name: string): string {
    if (this.register_form.get(control_name).getError('invalidPassword') && this.register_form.get(control_name).touched) {
      return this.register_form.get(control_name).getError('invalidPassword');
    } else {
      return null;
    }
  }
  public Email_validator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.personsService.Search_email(control.value).pipe(map(response => {
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
    return this.personsService.Search_login(control.value).pipe(map(response => {
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
    window.setTimeout(() => {
      const controls = this.register_form.controls;
      for (const key in controls) {
        if (this.Is_controle_invalid(key)) {
          return null;
        }
      }
      const count = this.personsService.users_count + 1;
      this.personsService.Load_count_names();
      const user = new User(
        this.register_form.value.admin,
        this.register_form.value.email,
        count,
        this.register_form.value.login,
        this.register_form.value.name,
        this.register_form.value.password,
        this.register_form.value.surname);
      const error = this.personsService.Add_user(user);
      localStorage.setItem('currentUser', JSON.stringify({ login: this.register_form.value.login, email: this.register_form.value.email,
      access_suggest: '1', access_write: '1'}));
      this.router.navigate(['/user', this.register_form.value.login]) ;
      return error;

    }, 3000);
  }
  Check_all_validators(): number {
      const controls = this.register_form.controls;
      for (const cont in controls) {
        if (this.Is_controle_invalid_full(cont)) {
          return 0;
        }
      }
      return 1;
  }
}
