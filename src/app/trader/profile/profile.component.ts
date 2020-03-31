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

  businessImage = new FormControl();
  imageUploadState?: Observable<number>;

  images$: Observable<Array<[string, Reference]>>;
  hasThumbnail: boolean;
  traderId: string;

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

    this.user.getAuthenticatedTraderProfile().subscribe((tp) => {
      this.hasThumbnail = tp.thumbnailUrl != null;
      this.traderId = this.user.getAuthenticatedUser().uid;
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
        this.dataFormGroup.markAsPristine();
      }
    });
  }

  async resendEmailVerification() {
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
    });
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
      await task.then(async () => (this.imageUploadState = null));
      this.businessImage.setValue(undefined);

      if (!this.hasThumbnail) {
        this.user
          .getTraderBusinessImageThumbnails()
          .subscribe(async (images) => {
            if (images && images.length > 0) {
              const url = await images[0].getDownloadURL();
              this.traderService.updateTraderThumbnail(this.traderId, url);
            }
          });
      }
      await this.loadImages();
    } catch (e) {
      this.errorService.publishByText(
        'Upload fehlgeschlagen',
        'Beim Upload des Bildes ist ein Fehler aufgetreten. Womöglich unterstützen wir das Format nicht oder das Bild ist zu groß'
      );
    }
  }

  async deleteImage(image: Reference) {
    await image.delete();
    this.loadImages();
  }
}
