import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  passwordResetForm = new UntypedFormGroup({
    email: new UntypedFormControl(''),
  });

  emailSent = false;

  constructor(private user: UserService) {}

  async onSubmit() {
    const email = this.passwordResetForm.get('email').value;

    try {
      await this.user.sendPasswordResetEmail(email);
      this.emailSent = true;
    } catch (e) {
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
