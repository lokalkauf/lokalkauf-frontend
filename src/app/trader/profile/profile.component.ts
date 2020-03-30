import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
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

  delivery = new FormControl(false);
  pickup = new FormControl(false);

  description = new FormControl('');
  businessImage = new FormControl();
  imageUploadState?: Observable<number>;

  images$: Observable<Array<[string, Reference]>>;
  hasThumbnail: boolean;
  traderId: string;

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
    this.loadImages();
  }

  ngAfterViewInit() {
    this.delivery.valueChanges.subscribe(async (delivery) => {
      await this.user.updateTraderProfile({ delivery });
    });

    this.pickup.valueChanges.subscribe(async (pickup) => {
      await this.user.updateTraderProfile({ pickup });
    });

    this.loggedInUserState$.subscribe((loggedInUser) => {
      if (loggedInUser.traderProfile.delivery !== this.delivery.value) {
        this.delivery.setValue(loggedInUser.traderProfile.delivery, {
          emitEvent: false,
        });
      }
      if (loggedInUser.traderProfile.pickup !== this.pickup.value) {
        this.pickup.setValue(loggedInUser.traderProfile.pickup, {
          emitEvent: false,
        });
      }
      if (
        !this.description.dirty &&
        loggedInUser.traderProfile.description !== this.description.value
      ) {
        this.description.setValue(loggedInUser.traderProfile.description, {
          emitEvent: false,
        });
        this.description.markAsPristine();
      }

      this.hasThumbnail = loggedInUser.traderProfile.thumbnailUrl != null;
      this.traderId = loggedInUser.uid;
    });
  }

  async resendEmailVerification() {
    await this.user.resendEmailVerification();
    // TODO: Inform user
  }

  async logout() {
    await this.user.logout();
  }

  async updateDescription() {
    await this.user.updateTraderProfile({
      description: this.description.value,
    });
    this.description.markAsPristine();
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
        this.user.getTraderBusinessImageThumbnails().subscribe((images) => {
          if (images && images.length > 0) {
            this.traderService.updateTraderThumbnail(
              this.traderId,
              images[0].fullPath
            );
          }
        });
      }
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
