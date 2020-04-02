import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Reference } from '@angular/fire/storage/interfaces';
import { map, flatMap } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { TraderService } from 'src/app/services/trader.service';
import { TraderProfileStatus } from 'src/app/models/traderProfile';

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
  mailResendedMessage: string;
  saveSuccessful = false;

  constructor(
    private user: UserService,
    router: Router,
    private errorService: ErrorService,
    private traderService: TraderService
  ) {
    this.loggedInUserState$ = user.loggedInUserState$;
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      }
    });

    this.user.getAuthenticatedTraderProfile().subscribe(async (tp) => {
      this.hasThumbnail = tp.thumbnailUrl != null;
      this.traderId = this.user.getAuthenticatedUser().uid;
      await this.updateTraderThumbnail();
    });

    this.loadImages();

    this.businessImage.valueChanges.subscribe((value) => console.log(value));
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
    }, 5000);
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
    if (!this.hasThumbnail) {
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
}
