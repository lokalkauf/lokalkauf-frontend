import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { uiTexts } from './../../services/uiTexts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });

  texts = uiTexts;
  constructor(private user: UserService, private router: Router) {
    user.isLoggedIn$.subscribe(async (isLoggedIn) => {
      if (isLoggedIn) {
        await this.router.navigateByUrl('/trader/profile');
      }
    });
  }

  async onSubmit() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    try {
      await this.user.login(email, password);
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-email':
          this.loginForm.setErrors({
            invalidMail: true,
          });
          break;
        case 'auth/user-disabled':
          this.loginForm.setErrors({
            userDisabled: true,
          });
          break;
        case 'auth/user-not-found':
          this.loginForm.setErrors({
            userNotFound: true,
          });
          break;
        case 'auth/wrong-password':
          this.loginForm.setErrors({
            wrongPassword: true,
          });
          break;
        default:
          this.loginForm.setErrors({
            undefinedError: true,
          });
          break;
      }
    }
  }
}
