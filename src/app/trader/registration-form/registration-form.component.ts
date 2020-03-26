import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent {
  productForm = new FormGroup(
    {
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
      passwordRepeat: new FormControl('', [Validators.required]),
    },
    [
      (formGroup) => {
        return formGroup.get('password').value ===
          formGroup.get('passwordRepeat').value
          ? null
          : { notSame: true };
      },
    ]
  );

  constructor(private auth: AngularFireAuth, router: Router) {
    this.auth.user.subscribe((user) => {
      if (user != null) {
        router.navigateByUrl(`trader/profile`);
      }
    });
  }

  async onSubmit() {
    const email = this.productForm.get('email').value;
    const password = this.productForm.get('password').value;

    try {
      const test = await this.auth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      test.user.sendEmailVerification();
    } catch (e) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          // TODO
          break;
        case 'auth/invalid-email':
          // TODO
          break;
        case 'auth/operation-not-allowed':
          // TODO
          break;
        case 'auth/weak-password':
          // TODO
          break;
        default:
          break;
      }
    }
  }
}
