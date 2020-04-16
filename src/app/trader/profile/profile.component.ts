import { Component, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from '../../services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorService } from '../../services/error.service';
import { TraderProfileStatus } from '../../models/traderProfile';
import { ImageService } from '../../services/image.service';
import { ImageSource } from '../../models/imageSource';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements AfterViewInit {
  loggedInUserState$: Observable<LoggedInUserState>;

  dataFormGroup = new FormGroup(
    {
      delivery: new FormControl(false),
      pickup: new FormControl(false),
      sonstiges: new FormControl(false),
      description: new FormControl(''),
      storeEmail: new FormControl(''),
      homepage: new FormControl(''),
      public: new FormControl(true),
    },
    (form) => {
      const pickup = form.get('pickup').value;
      const delivery = form.get('delivery').value;
      return !pickup && !delivery ? { notDeliveryAndPickup: true } : null;
    }
  );

  storeFormGroup = new FormGroup(
    {
      gastronomie: new FormControl(false),
      lebensmittel: new FormControl(false),
      fashion: new FormControl(false),
      buchhandlung: new FormControl(false),
      homedecor: new FormControl(false),
      blumengarten: new FormControl(false),
      handwerk: new FormControl(false),
      sonstiges: new FormControl(false),
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

  businessImage = new FormControl();
  imageUploadState?: Observable<number>;

  images: Array<ImageSource>;
  mailResendedMessage: string;
  saveSuccessful = false;

  constructor(
    private user: UserService,
    router: Router,
    private errorService: ErrorService,
    private imageService: ImageService
  ) {
    this.loggedInUserState$ = user.loggedInUserState$.pipe(
      filter((loggedInUser) => loggedInUser != null)
    );
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      } else {
        this.loadImages();
      }
    });
  }

  ngAfterViewInit() {
    this.loggedInUserState$.subscribe((loggedInUser) => {
      if (!this.dataFormGroup.dirty && !this.storeFormGroup.dirty) {
        this.delivery.setValue(loggedInUser.traderProfile.delivery, {
          emitEvent: false,
        });
        this.pickup.setValue(loggedInUser.traderProfile.pickup, {
          emitEvent: false,
        });
        this.description.setValue(loggedInUser.traderProfile.description, {
          emitEvent: false,
        });
        this.storeEmail.setValue(loggedInUser.traderProfile.storeEmail, {
          emitEvent: false,
        });
        this.homepage.setValue(loggedInUser.traderProfile.homepage, {
          emitEvent: false,
        });
        this.gastronomie.setValue(
          loggedInUser.traderProfile.storeType.gastronomie,
          {
            emitEvent: false,
          }
        );
        if (loggedInUser.traderProfile.storeType) {
          this.lebensmittel.setValue(
            loggedInUser.traderProfile.storeType.lebensmittel,
            {
              emitEvent: false,
            }
          );
          this.fashion.setValue(loggedInUser.traderProfile.storeType.fashion, {
            emitEvent: false,
          });
          this.buchhandlung.setValue(
            loggedInUser.traderProfile.storeType.buchhandlung,
            {
              emitEvent: false,
            }
          );
          this.homedecor.setValue(
            loggedInUser.traderProfile.storeType.homedecor,
            {
              emitEvent: false,
            }
          );
          this.blumengarten.setValue(
            loggedInUser.traderProfile.storeType.blumengarten,
            {
              emitEvent: false,
            }
          );
          this.handwerk.setValue(
            loggedInUser.traderProfile.storeType.handwerk,
            {
              emitEvent: false,
            }
          );
          this.sonstiges.setValue(
            loggedInUser.traderProfile.storeType.sonstiges,
            {
              emitEvent: false,
            }
          );
        }

        this.public.setValue(
          loggedInUser.traderProfile.status === TraderProfileStatus.PUBLIC,
          {
            emitEvent: false,
          }
        );
        this.dataFormGroup.markAsPristine();
      }
    });
  }

  async resendEmailVerification() {
    this.mailResendedMessage = 'Bestätigungsmail wurde erneut versendet!';
    await this.user.resendEmailVerification();
    // TODO: Inform user
  }

  async logout() {
    await this.user.logout();
  }

  async updateProfile() {
    await this.user.updateTraderProfile({
      description: this.description.value || null,
      delivery: this.delivery.value || null,
      pickup: this.pickup.value || null,
      storeEmail: this.storeEmail.value || null,
      homepage: this.homepage.value || null,
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
    this.saveSuccessful = true;
    setTimeout(() => {
      this.saveSuccessful = false;
    }, 15000);
  }

  async loadImages() {
    this.images = await this.user.getAllTraderImages();
  }

  async uploadImage() {
    try {
      const file = this.businessImage.value;
      const task = this.user.uploadTraderImage(file);

      this.imageUploadState = task.percentageChanges();
      await task;
      this.imageUploadState = null;
      this.businessImage.setValue(undefined);

      await this.loadImages();

      if (this.images.length === 1) {
        await this.setDefaultImage(this.images[0]);
      }
    } catch (e) {
      this.errorService.publishByText(
        'Upload fehlgeschlagen',
        'Beim Upload des Bildes ist ein Fehler aufgetreten. Womöglich unterstützen wir das Format nicht oder das Bild ist zu groß'
      );
    }
  }

  async deleteImage(image: ImageSource, isDefaultImage: boolean) {
    await this.imageService.delteImageByUrl(image.url);
    await this.loadImages();
    if (isDefaultImage && this.images.length > 0) {
      await this.setDefaultImage(this.images[0]);
    }
    if (isDefaultImage && this.images.length === 0) {
      await this.removeDefaultImage();
    }
  }

  async setDefaultImage(image: ImageSource) {
    await this.user.updateTraderProfile({ defaultImagePath: image.path });
  }

  async removeDefaultImage() {
    await this.user.updateTraderProfile({ defaultImagePath: '' });
  }
}
