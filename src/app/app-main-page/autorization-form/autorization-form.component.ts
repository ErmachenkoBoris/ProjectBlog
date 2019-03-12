import {Component, DoCheck, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UsersService} from '../../users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-autorization-form',
  templateUrl: './autorization-form.component.html',
  styleUrls: ['./autorization-form.component.less']
})
export class AutorizationFormComponent implements OnInit {

  authorization_form: FormGroup;
  constructor(private fb: FormBuilder, private usesrService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.InitForm();
  }
  InitForm(): void {
    this.authorization_form = this.fb.group({
      login : ['', [Validators.required, Validators.pattern(/^[A-z0-9]+$/u)], [ (control: AbstractControl):
        Observable<ValidationErrors | null> =>
        this.Password_and_login_validator(control), this.Login_validator
      ]],
      password: ['', [Validators.required], [(control: AbstractControl):
      Observable<ValidationErrors | null> =>
      this.Login_and_password_validator(control)]]
    });
  }
  Is_controle_invalid(name_contole: string): boolean {
    const control = this.authorization_form.controls[name_contole];
    return control.invalid && control.touched;
  }

  public Login_and_password_validator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usesrService.Search_user_by_login_and_password(this.authorization_form.value.login, control.value).pipe(map(response => {
      if (response) {
        if (response.length !== 1) {
          return {Incorrect_data: 'login or password incorret'};
        } else {
          if (this.authorization_form.controls['login'].invalid) {
            // console.log(1);
            this.authorization_form.controls['login'].updateValueAndValidity();
          }
          return null;
        }
      } else {
        if (this.authorization_form.controls['login'].invalid) {
          this.authorization_form.controls['login'].updateValueAndValidity();
        }
        return null;
      }
    }));
  }
  public Password_and_login_validator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usesrService.Search_user_by_login_and_password(control.value, this.authorization_form.value.password).pipe( map(
      response => {
      if (response) {
        if (response.length !== 1) {
          return {Incorrect_data: 'login or password incorret'};
        } else {
          if (this.authorization_form.controls['password'].invalid) {
            this.authorization_form.controls['password'].updateValueAndValidity();
            // console.log(2);
          }
          return null;
        }
      } else {
        if (this.authorization_form.controls['password'].invalid) {
          this.authorization_form.controls['password'].updateValueAndValidity();
        }
        return null;
      }
    }));
  }
  public Login_validator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return this.usesrService.Search_login(control.value).pipe(map(response => {
      if (response) {
        if (response.length !== 1) {
          return null;
        } else {
          return {LoginNoExist: 'Login No exist'};
        }
      } else {
        return {LoginNoExist: 'Login No exist'};
      }
    }));
  }
  Check_all_validators(): number {
    const controls = this.authorization_form.controls;
    for (const cont in controls) {
      if (this.Is_controle_invalid_full(cont)) {
        return 0;
      }
    }
    return 1;
  }
  Is_controle_invalid_full(name_controle: string): boolean {
    const contol = this.authorization_form.controls[name_controle];
    return contol.invalid;
  }
  Submit_form_add(): any {
  window.setTimeout(() => {
    const controls = this.authorization_form.controls;
    for (const key in controls) {
      if (this.Is_controle_invalid(key)) {
        return null;
      }
    }
    if (this.usesrService.admin === 1) {
      this.router.navigate(['/admin', this.authorization_form.value.login]);
    } else {
      this.router.navigate(['/user', this.authorization_form.value.login]);
    }
    return 1;

  }, 2000);
}
}
