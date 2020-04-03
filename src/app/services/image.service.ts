import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap, flatMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ImageSource } from '../models/imageSource';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  currentUserId: string;

  constructor(
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    auth.user.subscribe((user) => {
      this.currentUserId = user.uid;
    });
  }

  async getAllTraderThumbnails(traderId: string): Promise<ImageSource[]> {
    const imageList = await this.storage.storage
      .ref(`Traders/${traderId}/BusinessImages/thumbs`)
      .list();

    const images = await Promise.all(
      imageList.items.map(async (item) => {
        const metadata = (await item.getMetadata()) as firebase.storage.FullMetadata;
        if (metadata.contentType.startsWith('image/')) {
          return {
            url: await item.getDownloadURL(),
            size: metadata.size,
            name: metadata.name,
          };
        }
      })
    );

    return images.filter((item) => item != null);
  }

  async getAllCurrentTraderThumbnails() {
    return this.getAllTraderThumbnails(this.currentUserId);
  }

  async getAllTraderThumbnailUrls(traderId: string) {
    return (await this.getAllTraderThumbnails(traderId)).map((i) => i.url);
  }

  async getAllCurrentTraderThumbnailUrls() {
    return this.getAllTraderThumbnailUrls(this.currentUserId);
  }

  async getAllTraderImages(traderId: string): Promise<ImageSource[]> {
    const imageList = await this.storage.storage
      .ref(`Traders/${traderId}/BusinessImages`)
      .list();
    const images = await Promise.all(
      imageList.items.map(async (item) => {
        const metadata = (await item.getMetadata()) as firebase.storage.FullMetadata;
        if (metadata.contentType.startsWith('image/')) {
          return {
            url: await item.getDownloadURL(),
            size: metadata.size,
            name: metadata.name,
          };
        }
      })
    );

    return images.filter((item) => item != null);
  }

  async getAllCurrentTraderImages() {
    return this.getAllTraderImages(this.currentUserId);
  }

  async getAllTraderImageUrls(traderId: string) {
    return (await this.getAllTraderImages(traderId)).map((i) => i.url);
  }

  async getAllCurrentTraderImageUrls() {
    return this.getAllTraderImageUrls(this.currentUserId);
  }

  uploadTraderImage(traderId: string, file: File) {
    const filePath = `Traders/${traderId}/BusinessImages/${uuid()}-${
      file.name
    }`;
    return this.storage.upload(filePath, file);
  }

  uploadCurrentTraderImage(file: File) {
    return this.uploadTraderImage(this.currentUserId, file);
  }

  async delteImageByUrl(url: string) {
    const imgRef = this.storage.storage.refFromURL(url);
    if (imgRef) {
      await imgRef.delete();
    }
  }
}
