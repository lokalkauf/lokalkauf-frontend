import {
  Component,
  AfterViewInit,
  Input,
  OnInit,
  OnChanges,
} from '@angular/core';
import { TraderProfileStatus } from 'src/app/models/traderProfile';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'lk-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit, OnChanges {
  @Input() loggedInUserState: LoggedInUserState;

  dataFormGroup = new UntypedFormGroup(
    {
      delivery: new UntypedFormControl(false),
      pickup: new UntypedFormControl(false),
      sonstiges: new UntypedFormControl(false),
      description: new UntypedFormControl(''),
      storeEmail: new UntypedFormControl(''),
      homepage: new UntypedFormControl(''),
      public: new UntypedFormControl(true),
      soMeShare: new UntypedFormControl(false),
    },
    (form) => {
      const pickup = form.get('pickup').value;
      const delivery = form.get('delivery').value;
      return !pickup && !delivery ? { notDeliveryAndPickup: true } : null;
    }
  );

  storeFormGroup = new UntypedFormGroup(
    {
      gastronomie: new UntypedFormControl(false),
      lebensmittel: new UntypedFormControl(false),
      fashion: new UntypedFormControl(false),
      buchhandlung: new UntypedFormControl(false),
      homedecor: new UntypedFormControl(false),
      blumengarten: new UntypedFormControl(false),
      handwerk: new UntypedFormControl(false),
      sonstiges: new UntypedFormControl(false),
    },
    (form) => {
      const gastronomie = form.get('gastronomie').value;
      const lebensmittel = form.get('lebensmittel').value;
      const fashion = form.get('fashion').value;
      const buchhandlung = form.get('buchhandlung').value;
      const homedecor = form.get('homedecor').value;
      const blumengarten = form.get('blumengarten').value;
      const handwerk = form.get('handwerk').value;
      const sonstiges = form.get('sonstiges').value;
      const selectedStoreTypes = [
        gastronomie,
        lebensmittel,
        fashion,
        buchhandlung,
        homedecor,
        blumengarten,
        handwerk,
        sonstiges,
      ].filter((v) => v).length;
      return selectedStoreTypes > 2 || selectedStoreTypes === 0
        ? { storeCountError: true }
        : null;
    }
  );

  get description() {
    return this.dataFormGroup.get('description');
  }

  get pickup() {
    return this.dataFormGroup.get('pickup');
  }

  get delivery() {
    return this.dataFormGroup.get('delivery');
  }

  get storeEmail() {
    return this.dataFormGroup.get('storeEmail');
  }

  get homepage() {
    return this.dataFormGroup.get('homepage');
  }

  get soMeShare() {
    return this.dataFormGroup.get('soMeShare');
  }

  get public() {
    return this.dataFormGroup.get('public');
  }

  get gastronomie() {
    return this.storeFormGroup.get('gastronomie');
  }

  get lebensmittel() {
    return this.storeFormGroup.get('lebensmittel');
  }

  get fashion() {
    return this.storeFormGroup.get('fashion');
  }

  get buchhandlung() {
    return this.storeFormGroup.get('buchhandlung');
  }

  get homedecor() {
    return this.storeFormGroup.get('homedecor');
  }

  get blumengarten() {
    return this.storeFormGroup.get('blumengarten');
  }

  get handwerk() {
    return this.storeFormGroup.get('handwerk');
  }

  get sonstiges() {
    return this.storeFormGroup.get('sonstiges');
  }

  saveSuccessful = false;

  constructor(private user: UserService) {}

  ngOnChanges(changes) {
    if (
      changes.loggedInUserState &&
      !this.dataFormGroup.dirty &&
      !this.storeFormGroup.dirty
    ) {
      this.updateForm(this.loggedInUserState);
      this.dataFormGroup.markAsPristine();
      this.storeFormGroup.markAsPristine();
    }
  }

  ngOnInit() {
    this.updateForm(this.loggedInUserState);
    this.dataFormGroup.markAsPristine();
    this.storeFormGroup.markAsPristine();
  }

  updateForm(state: LoggedInUserState) {
    this.delivery.setValue(state.traderProfile.delivery, {
      emitEvent: false,
    });
    this.pickup.setValue(state.traderProfile.pickup, {
      emitEvent: false,
    });
    this.description.setValue(state.traderProfile.description, {
      emitEvent: false,
    });
    this.storeEmail.setValue(state.traderProfile.storeEmail, {
      emitEvent: false,
    });
    this.homepage.setValue(state.traderProfile.homepage, {
      emitEvent: false,
    });
    this.soMeShare.setValue(state.traderProfile.soMeShare, {
      emitEvent: false,
    });
    this.gastronomie.setValue(state.traderProfile.storeType.gastronomie, {
      emitEvent: false,
    });

    if (state.traderProfile.storeType) {
      this.lebensmittel.setValue(state.traderProfile.storeType.lebensmittel, {
        emitEvent: false,
      });
      this.fashion.setValue(state.traderProfile.storeType.fashion, {
        emitEvent: false,
      });
      this.buchhandlung.setValue(state.traderProfile.storeType.buchhandlung, {
        emitEvent: false,
      });
      this.homedecor.setValue(state.traderProfile.storeType.homedecor, {
        emitEvent: false,
      });
      this.blumengarten.setValue(state.traderProfile.storeType.blumengarten, {
        emitEvent: false,
      });
      this.handwerk.setValue(state.traderProfile.storeType.handwerk, {
        emitEvent: false,
      });
      this.sonstiges.setValue(state.traderProfile.storeType.sonstiges, {
        emitEvent: false,
      });
    }

    this.public.setValue(
      state.traderProfile.status === TraderProfileStatus.PUBLIC,
      {
        emitEvent: false,
      }
    );
  }

  async logout() {
    await this.user.logout();
  }

  async updateProfile() {
    if (
      this.dataFormGroup.errors != null ||
      this.storeFormGroup.errors != null
    ) {
      return;
    }

    await this.user.updateTraderProfile({
      description: this.description.value || null,
      delivery: this.delivery.value || null,
      pickup: this.pickup.value || null,
      storeEmail: this.storeEmail.value || null,
      homepage: this.homepage.value || null,
      soMeShare: this.soMeShare.value || null,
      storeType: {
        gastronomie: this.gastronomie.value || null,
        lebensmittel: this.lebensmittel.value || null,
        fashion: this.fashion.value || null,
        buchhandlung: this.buchhandlung.value || null,
        homedecor: this.homedecor.value || null,
        blumengarten: this.blumengarten.value || null,
        handwerk: this.handwerk.value || null,
        sonstiges: this.sonstiges.value || null,
      },
      status: this.public.value
        ? TraderProfileStatus.PUBLIC
        : TraderProfileStatus.VERIFIED,
    });

    this.dataFormGroup.markAsPristine();
    this.storeFormGroup.markAsPristine();
    this.saveSuccessful = true;
    setTimeout(() => {
      this.saveSuccessful = false;
    }, 15000);
  }
}
