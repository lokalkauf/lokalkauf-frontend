import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TraderProfile, TraderProfileStatus } from '../../models/traderProfile';
import { TraderService } from '../../services/trader.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { GeoService } from 'src/app/services/geo.service';
import { LkMapComponent } from 'src/app/reusables/lk-map/lk-map.component';

export enum RegistrationState {
  new = 'new',
  edit = 'edit',
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit, AfterViewInit {
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

  registrationState: RegistrationState;
  saveSuccessful = false;
  delete = false;
  isAaddressConfirmed = false;
  confirmAddressMode = false;
  confirmedLocation: number[];
  mapLocation: number[];

  @ViewChild(LkMapComponent) map: LkMapComponent;

  async ngAfterViewInit() {}

  updateMapLocation(location: number[]) {
    console.log('update map location: ' + location);
    this.map.flyTo({ latitude: location[0], longitude: location[1], zoom: 18 });
  }

  ngOnInit(): void {
    window.scrollBy(0, 0);
    this.setConditionalValidators();
  }

  setConditionalValidators() {
    const password = this.registrationForm.get('password');
    const password2 = this.registrationForm.get('passwordRepeat');
    const email = this.registrationForm.get('email');

    if (this.registrationState === RegistrationState.edit) {
      password.setValidators(null);
      password2.setValidators(null);
      email.setValidators(null);
    } else {
      password.setValidators([Validators.required]);
      password2.setValidators([Validators.required]);
      email.setValidators([Validators.required]);
    }
    password.updateValueAndValidity();
    password2.updateValueAndValidity();
    email.updateValueAndValidity();
  }

  fillVal(user: TraderProfile) {
    this.confirmedLocation = user.confirmedLocation;

    if (user.confirmedLocation) {
      this.updateMapLocation(user.confirmedLocation);
    } else {
      this.geo.getUserPosition().then((p) => this.updateMapLocation(p));
    }

    this.registrationForm.patchValue({
      phone: user.telephone,
      ownerFirstname: user.ownerFirstname.toString(),
      ownerLastname: user.ownerLastname.toString(),
      postcode: user.postcode.toString(),
      street: user.street,
      streetnumber: user.number,
      city: user.city,
      businessname: user.businessname,
    });
  }

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

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private geo: GeoService
  ) {
    if (router.url.match('new')) {
      this.registrationState = RegistrationState.new;
      this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          router.navigateByUrl(`trader/profile`);
        }
      });
    } else {
      this.registrationState = RegistrationState.edit;
      if (this.registrationState === RegistrationState.edit) {
        this.userService.getAuthenticatedTraderProfile().subscribe((user) => {
          if (user) {
            this.fillVal(user);
          }
        });
      }
    }
  }

  async onSubmit() {
    const email = this.email.value;
    const password = this.password.value;

    const traderProfilRegister: TraderProfile = {
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
      telephone: this.phone.value,
      email: this.email.value,
      storeEmail: '',
      homepage: '',
      status: TraderProfileStatus.CREATED,
      confirmedLocation: this.confirmedLocation,
      storeType: {
        gastronomie: false,
        lebensmittel: false,
        fashion: false,
        buchhandlung: false,
        homedecor: false,
        blumengarten: false,
        handwerk: false,
        sonstiges: false,
      },
    };

    const traderProfileUpdate: Partial<TraderProfile> = {
      businessname: this.businessname.value,
      ownerFirstname: this.ownerFirstname.value,
      ownerLastname: this.ownerLastname.value,
      postcode: this.postcode.value,
      city: this.city.value,
      street: this.street.value,
      number: this.streetnumber.value,
      telephone: this.phone.value,
      confirmedLocation: this.confirmedLocation,
    };

    try {
      if (this.registrationState === RegistrationState.new) {
        await this.userService.register(email, password, traderProfilRegister);
      } else {
        await this.userService.updateTraderProfile(traderProfileUpdate);
        this.saveSuccessful = true;
        setTimeout(() => {
          this.saveSuccessful = false;
        }, 15000);
      }
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

  firstPasswordError() {
    return (
      (this.firstOrSecondPasswordChanged() && this.password.invalid) ||
      (this.registrationForm.errors && this.registrationForm.errors.notSame)
    );
  }

  private firstOrSecondPasswordChanged() {
    return this.password.touched || this.passwordRepeat.touched;
  }

  checkPasswordEquality() {
    return (
      this.registrationForm.get('password').value ===
      this.registrationForm.get('passwordRepeat').value
    );
  }

  deleteProfile() {
    const dialog = this.dialog.open(DeleteUserComponent);
    dialog.afterClosed().subscribe(() => console.log('closed'));
  }

  openConfirmationMode() {
    this.confirmAddressMode = true;
  }

  confirmAddress() {
    this.confirmAddressMode = false;
    this.confirmedLocation = this.mapLocation;
  }

  cancelAddressConfirmation() {
    this.confirmAddressMode = false;
  }

  onMapMove(pos: any) {
    console.log('position moved: ' + pos);
    console.log(pos);
    this.mapLocation = [pos.lat, pos.lng];
  }

  verwerfen() {
    this.router.navigate(['/trader/profile']);
  }

  needConfirmation() {
    return this.addressWasChanged() || !this.confirmedLocation; // && !this.isAaddressConfirmed);
  }

  addressWasChanged() {
    return (
      this.city.dirty ||
      this.postcode.dirty ||
      this.street.dirty ||
      this.streetnumber.dirty
    );
  }
}
