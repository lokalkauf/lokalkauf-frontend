import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent {
  registrationForm = new FormGroup(
    {
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
      passwordRepeat: new FormControl('', [Validators.required]),
    },
    [
      (formGroup) => {
        return formGroup.get('password').value ===
          formGroup.get('passwordRepeat').value
          ? formGroup.get('email').errors
          : { notSame: true };
      },
    ]
  );

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get passwordRepeat() {
    return this.registrationForm.get('passwordRepeat');
  }

  constructor(private userService: UserService, router: Router) {
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigateByUrl(`trader/profile`);
      }
    });
  }

  async onSubmit() {
    const email = this.registrationForm.get('email').value;
    const password = this.registrationForm.get('password').value;

    try {
      await this.userService.register(email, password);
    } catch (e) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          this.registrationForm.setErrors({
            emailInUse: true,
          });
          break;
        case 'auth/invalid-email':
          this.registrationForm.setErrors({
            invalidEmail: true,
          });
          break;
        case 'auth/operation-not-allowed':
          // TODO
          break;
        case 'auth/weak-password':
          this.registrationForm.setErrors({
            weakPassword: true,
          });
          break;
        default:
          break;
      }
    }
  }
}
