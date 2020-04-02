import { Component, AfterViewInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Reference } from '@angular/fire/storage/interfaces';
import { flatMap } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { TraderService } from 'src/app/services/trader.service';
import {
  TraderProfileStatus,
  TraderProfile,
} from 'src/app/models/traderProfile';
import { v1 as uuid } from 'uuid';
import { flipInY } from '@angular-material-extensions/password-strength';

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

  get public() {
    return this.dataFormGroup.get('public');
  }

  businessImage = new FormControl();
  imageUploadState?: Observable<number>;

  images$: Observable<Array<[string, Reference]>>;
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
    private traderService: TraderService
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
          await this.updateTraderThumbnail();
        });
      }
    });

    this.loadImages();
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
    this.mailResendedMessage = 'Bestätigungsmail wurde erneu versendet!';
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
      status: this.public.value
        ? TraderProfileStatus.PUBLIC
        : TraderProfileStatus.VERIFIED,
    });
    await this.updateTraderThumbnail();

    this.dataFormGroup.markAsPristine();
    this.saveSuccessful = true;
    setTimeout(() => {
      this.saveSuccessful = false;
    }, 15000);
  }

  async loadImages() {
    this.images$ = this.user
      .getTraderBusinessImages()
      .pipe(
        flatMap((images) =>
          from(
            Promise.all(
              images.map((image) =>
                Promise.all([image.getDownloadURL(), image])
              )
            )
          )
        )
      );
  }

  async uploadImage() {
    try {
      const file = this.businessImage.value;

      // workaround for missing file.name.
      // upload component should be refactored
      file.name = 'WR' + uuid() + 'WR' + file.type.replace('image/', '.');

      const task = this.user.uploadBusinessImage(file);

      this.imageUploadState = task.percentageChanges();
      await task.then(async (i) => (this.imageUploadState = null));
      this.businessImage.setValue(undefined);

      await this.updateTraderThumbnail();
      await this.loadImages();
    } catch (e) {
      this.errorService.publishByText(
        'Upload fehlgeschlagen',
        'Beim Upload des Bildes ist ein Fehler aufgetreten. Womöglich unterstützen wir das Format nicht oder das Bild ist zu groß'
      );
    }
  }

  async updateTraderThumbnail() {
    if (!this.hasThumbnail && this.traderId) {
      this.user.getTraderBusinessImageThumbnails().subscribe(async (images) => {
        if (images && images.length > 0) {
          const url = await images[0].getDownloadURL();
          this.traderService.updateTraderThumbnail(this.traderId, url);
        }
      });
    }
  }

  async deleteImage(image: Reference) {
    await image.delete();
    await this.loadImages();
  }

  async setThumbnail(image: Reference) {
    const tid = this.user.getAuthenticatedUser().uid;
    const thumbnails = await this.traderService.getTraderBusinessImageThumbnails(
      tid
    );

    const name = image.name.substring(0, image.name.lastIndexOf('.'));

    if (thumbnails && thumbnails.length > 0) {
      thumbnails.forEach(async (t) => {
        const url = (await t.getDownloadURL()) as string;

        if (url.indexOf(name) > -1) {
          this.traderService.updateTraderThumbnail(tid, url);
        }
      });
    }

    // this.traderService.updateTraderThumbnail(this.traderId, url);
  }

  isSelectedThumbnail(image: Reference) {
    let isThumbnail = false;

    if (this.traderProfil) {
      const name = image.name.substring(0, image.name.lastIndexOf('.'));
      const currentThumbnail = this.traderProfil.thumbnailUrl
        ? this.traderProfil.thumbnailUrl
        : '###';
      isThumbnail = currentThumbnail.indexOf(name) > -1;
    }

    return isThumbnail ? 'icn-success' : 'icn-disabled';
  }
}
