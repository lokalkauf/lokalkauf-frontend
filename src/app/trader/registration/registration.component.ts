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
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { GeoService } from 'src/app/services/geo.service';
import { LkMapComponent } from 'src/app/reusables/lk-map/lk-map.component';
import { uiTexts } from 'src/app/services/uiTexts';
import { BehaviorSubject } from 'rxjs';

export enum RegistrationState {
  new = 'new',
  edit = 'edit',
}

interface AdditionalValidationElements {
  confirmCoordinates: boolean;
}
interface AdditionalValidation {
  errors: AdditionalValidationElements;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  //#region props
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
  //#endregion

  additionalValidation: AdditionalValidation = {
    errors: { confirmCoordinates: false },
  };
  text = uiTexts;

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
          router.navigateByUrl(`trader/profile`, { skipLocationChange: true });
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
  startAddressConfirmation = false;
  confirmedLocation: number[];
  mapLocation: number[];
  confirmedAddress: string;

  needsConfirmation$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChild(LkMapComponent) map: LkMapComponent;

  centerMarkrID: any;

  async ngAfterViewInit() {
    this.onMapInit();
  }

  ngOnInit(): void {
    window.scrollBy(0, 0);
    this.setConditionalValidators();
    this.registrationForm.valueChanges.subscribe(() => {
      this.checkAdressChange();
    });
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

    if (this.confirmedLocation) {
      this.confirmedAddress = this.addressHash();
    }
    this.checkAdressChange();
  }

  async onSubmit() {
    const email = this.email.value;
    const password = this.password.value;

    if (this.additionalValidationErrors()) {
      return;
    }

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
      soMeShare: false,
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

  additionalValidationErrors(): boolean {
    this.additionalValidation.errors.confirmCoordinates = this.needConfirmation();
    return this.additionalValidation.errors.confirmCoordinates;
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

  async openConfirmationMode() {
    if (this.addressWasChanged()) {
      const foundLocation = await this.geo.findCoordinatesByFullAddress(
        this.postcode.value,
        this.city.value,
        this.street.value,
        this.streetnumber.value
      );

      if (foundLocation) {
        this.updateMapLocation(foundLocation.coordinates);
      } else {
        this.updateMapLocation(
          foundLocation
            ? foundLocation.coordinates
            : await this.geo.getUserPosition()
        );
      }
    } else if (this.confirmedLocation) {
      this.updateMapLocation(this.confirmedLocation);
    }

    this.startAddressConfirmation = true;
  }

  confirmAddress() {
    this.confirmAddressMode = false;
    this.isAaddressConfirmed = true;
    this.confirmedLocation = this.mapLocation;
    this.confirmedAddress = this.addressHash();
    this.checkAdressChange();
    this.additionalValidationErrors();
  }

  cancelAddressConfirmation() {
    this.confirmAddressMode = false;
  }

  onMapMove(pos: any) {
    this.mapLocation = [pos.lat, pos.lng];
    this.map.updateMarkerPosition(this.centerMarkrID, this.mapLocation);
  }

  onMapFlyEnd(pos: any) {
    if (this.startAddressConfirmation) {
      this.startAddressConfirmation = false;
      this.confirmAddressMode = true;
    }
  }

  onMapInit() {
    this.centerMarkrID = this.map.addMarker();
    this.addressWasChanged();
  }

  updateMapLocation(location: number[]) {
    this.map.setCenter(location);
  }

  verwerfen() {
    this.router.navigate(['/trader/profile']);
  }

  needConfirmation() {
    const confirm = this.isAaddressConfirmed
      ? false
      : this.addressWasChanged() || !this.confirmedLocation;
    return confirm;
  }

  addressWasChanged() {
    return this.addressHash() !== this.confirmedAddress;
  }

  addressHash(): string {
    return (
      this.city.value +
      ':' +
      this.postcode.value +
      ':' +
      this.street.value +
      ':' +
      this.streetnumber.value
    );
  }

  checkAdressChange() {
    this.needsConfirmation$.next(this.addressWasChanged());
  }
}
