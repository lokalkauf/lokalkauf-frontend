import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  passwordResetForm = new FormGroup({
    email: new FormControl(''),
  });

  emailSent = false;

  constructor(private user: UserService) {}

  async onSubmit() {
    const email = this.passwordResetForm.get('email').value;

    try {
      await this.user.sendPasswordResetEmail(email);
      this.emailSent = true;
    } catch (e) {
      console.log(e);
      switch (e.code) {
        case 'auth/invalid-email':
          this.passwordResetForm.setErrors({
            invalidMail: true,
          });
          break;
        case 'auth/user-not-found':
          this.passwordResetForm.setErrors({
            userNotFound: true,
          });
          break;
        default:
          this.passwordResetForm.setErrors({
            undefinedError: true,
          });
          break;
      }
    }
  }
}
