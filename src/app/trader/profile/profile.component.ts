import { Component, AfterViewInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Reference } from '@angular/fire/storage/interfaces';
import { flatMap, map, tap } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { TraderService } from 'src/app/services/trader.service';
import {
  TraderProfileStatus,
  TraderProfile,
} from 'src/app/models/traderProfile';
import { v1 as uuid } from 'uuid';
import { flipInY } from '@angular-material-extensions/password-strength';
import { ImageService } from 'src/app/services/image.service';
import { ImageSource } from 'src/app/models/imageSource';

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
      description: new FormControl(''),
      homepage: new FormControl(''),
      public: new FormControl(true),
    },
    (form) => {
      const pickup = form.get('pickup').value;
      const delivery = form.get('delivery').value;
      return !pickup && !delivery ? { notDeliveryAndPickup: true } : null;
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

  get homepage() {
    return this.dataFormGroup.get('homepage');
  }

  get public() {
    return this.dataFormGroup.get('public');
  }

  businessImage = new FormControl();
  imageUploadState?: Observable<number>;

  images: Array<ImageSource>;
  hasThumbnail: boolean;
  traderId: string;
  traderProfil: TraderProfile;
  mailResendedMessage: string;
  saveSuccessful = false;

  constructor(
    private user: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private traderService: TraderService,
    private imageService: ImageService
  ) {
    this.loggedInUserState$ = user.loggedInUserState$;
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      } else {
        this.user.getAuthenticatedTraderProfile().subscribe(async (tp) => {
          this.traderProfil = tp;
          this.hasThumbnail = tp.thumbnailUrl != null;
          this.traderId = this.user.getAuthenticatedUser().uid;
          await this.loadImages();
          await this.setTraderThumbnailIfNotExists();
        });
      }
    });
  }

  ngAfterViewInit() {
    this.loggedInUserState$.subscribe((loggedInUser) => {
      if (!this.dataFormGroup.dirty) {
        this.delivery.setValue(loggedInUser.traderProfile.delivery, {
          emitEvent: false,
        });
        this.pickup.setValue(loggedInUser.traderProfile.pickup, {
          emitEvent: false,
        });
        this.description.setValue(loggedInUser.traderProfile.description, {
          emitEvent: false,
        });
        this.homepage.setValue(loggedInUser.traderProfile.homepage, {
          emitEvent: false,
        });
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
      description: this.description.value,
      delivery: this.delivery.value,
      pickup: this.pickup.value,
      homepage: this.homepage.value,
      status: this.public.value
        ? TraderProfileStatus.PUBLIC
        : TraderProfileStatus.VERIFIED,
    });
    await this.setTraderThumbnailIfNotExists();

    this.dataFormGroup.markAsPristine();
    this.saveSuccessful = true;
    setTimeout(() => {
      this.saveSuccessful = false;
    }, 15000);
  }

  async loadImages() {
    this.images = await this.imageService.getAllCurrentTraderImages();
  }

  async uploadImage() {
    try {
      const file = this.businessImage.value;

      // workaround for missing file.name.
      // upload component should be refactored
      file.name = 'WR' + uuid() + 'WR' + file.type.replace('image/', '.');

      const task = this.imageService.uploadCurrentTraderImage(file);

      this.imageUploadState = task.percentageChanges();
      await task.then(async (i) => (this.imageUploadState = null));
      this.businessImage.setValue(undefined);

      await this.setTraderThumbnailIfNotExists();
      await this.loadImages();
    } catch (e) {
      this.errorService.publishByText(
        'Upload fehlgeschlagen',
        'Beim Upload des Bildes ist ein Fehler aufgetreten. Womöglich unterstützen wir das Format nicht oder das Bild ist zu groß'
      );
    }
  }

  async deleteImage(image: ImageSource) {
    await this.imageService.delteImageByUrl(image.url);
    await this.loadImages();
  }

  async setTraderThumbnailIfNotExists() {
    if (!this.hasThumbnail && this.traderId) {
      // const imgs = await this.images$.toPromise();
      if (this.images && this.images.length > 0) {
        await this.setThumbnail(this.images[0]);
      }
    }
  }

  async setThumbnail(image: ImageSource) {
    const thumbnails = await this.imageService.getAllCurrentTraderThumbnailUrls();
    const name = ImageSource.nameWithoutExtension(image.name);

    if (thumbnails && thumbnails.length > 0) {
      for (const t of thumbnails) {
        if (t.indexOf(name) > -1) {
          await this.traderService.updateTraderThumbnailUrl(this.traderId, t);
          break;
        }
      }
    }
  }

  isSelectedThumbnail(image: ImageSource) {
    return ImageSource.isPartOf(image.name, this.traderProfil.thumbnailUrl)
      ? 'icn-success'
      : 'icn-disabled';
  }
}
