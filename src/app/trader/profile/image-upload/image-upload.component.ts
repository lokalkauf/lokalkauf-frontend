import { Component, OnInit, Input } from '@angular/core';
import { ImageSource } from 'src/app/models/imageSource';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { ErrorService } from 'src/app/services/error.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserService } from 'src/app/services/browser.service';

@Component({
  selector: 'lk-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @Input() loggedInUserState: LoggedInUserState;
  images: Array<ImageSource>;

  businessImage = new FormControl();
  imageUploadState?: Observable<number>;

  isBrowserSupported: boolean;
  browserName: string;

  constructor(
    private user: UserService,
    private imageService: ImageService,
    private errorService: ErrorService,
    private browserService: BrowserService
  ) {
    this.isBrowserSupported = browserService.isBrowserSupported();
    this.browserName = browserService.getCurrentBrowser();
  }

  ngOnInit(): void {
    this.loadImages();
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
