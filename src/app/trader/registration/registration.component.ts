import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TraderProfile } from 'src/app/models/traderProfile';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm = new FormGroup(
    {
      businessname: new FormControl('', [Validators.required]),
      ownerFirstname: new FormControl(''),
      ownerLastname: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
      ]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      streetnumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
      passwordRepeat: new FormControl('', [Validators.required]),
      agbRead: new FormControl('', [Validators.requiredTrue]),
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

  get postcode() {
    return this.registrationForm.get('postcode');
  }

  get city() {
    return this.registrationForm.get('city');
  }

  get street() {
    return this.registrationForm.get('street');
  }

  get streetnumber() {
    return this.registrationForm.get('streetnumber');
  }

  get agbread() {
    return this.registrationForm.get('agbRead');
  }

  get phone() {
    return this.registrationForm.get('phone');
  }

  get businessname() {
    return this.registrationForm.get('businessname');
  }

  get ownerFirstname() {
    return this.registrationForm.get('ownerFirstname');
  }

  get ownerLastname() {
    return this.registrationForm.get('ownerLastname');
  }

  constructor(private userService: UserService, router: Router) {
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigateByUrl(`trader/profile`);
      }
    });
  }

  async onSubmit() {
    const email = this.email.value;
    const password = this.password.value;

    const traderProfile: TraderProfile = {
      businessname: this.businessname.value,
      ownerFirstname: this.ownerFirstname.value,
      ownerLastname: this.ownerLastname.value,
      postcode: this.postcode.value,
      city: this.city.value,
      street: this.street.value,
      number: this.streetnumber.value,
      description: '',
      delivery: false,
      pickup: false,
      telephone: '',
      email: '',
    };

    try {
      await this.userService.register(email, password, traderProfile);
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
          this.registrationForm.setErrors({
            undefinedError: true,
          });
          break;
        case 'auth/weak-password':
          this.registrationForm.setErrors({
            weakPassword: true,
          });
          break;
        default:
          this.registrationForm.setErrors({
            undefinedError: true,
          });
          break;
      }
    }
  }
}
