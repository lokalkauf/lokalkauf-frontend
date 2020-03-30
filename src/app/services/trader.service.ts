import { Injectable, Query } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, FieldPath } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable, combineLatest, of, from } from 'rxjs';
import { map, switchMap, flatMap } from 'rxjs/operators';
import { TraderProfile } from '../models/traderProfile';
import { AngularFireStorage } from '@angular/fire/storage';
import { Reference } from '@angular/fire/storage/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TraderService {
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async createTraderProfile(id: string, trader: TraderProfile) {
    await this.db.collection('Traders').doc(id).set(trader);
  }

  getTraderProfiles(
    traderIds: Array<string>
  ): Observable<Array<TraderProfile>> {
    return this.db
      .collection<TraderProfile>('Traders', (ref) =>
        ref.where(firestore.FieldPath.documentId(), 'in', traderIds)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            return { ...data, id: a.payload.doc.id };
          });
        })
      );
  }

  async getTraderBusinessImageThumbnails(traderId: string) {
    const imageList = await this.storage.storage
      .ref(`Traders/${traderId}/BusinessImages/thumbs`)
      .list();
    const images = await Promise.all(
      imageList.items.map(async (item) => {
        const metadata = await item.getMetadata();
        if (metadata.contentType.startsWith('image/')) {
          return item;
        }
      })
    );
    return images.filter((item) => item != null);
  }

  async getTraderBusinessImages(
    traderId: string
  ): Promise<firebase.storage.Reference[]> {
    const imageList = await this.storage.storage
      .ref(`Traders/${traderId}/BusinessImages`)
      .list();
    const images = await Promise.all(
      imageList.items.map(async (item) => {
        const metadata = await item.getMetadata();
        if (metadata.contentType.startsWith('image/')) {
          return item;
        }
      })
    );
    return images.filter((item) => item != null);
  }

  getTraderBusinessImageUrls(traderId: string): Observable<Array<string>> {
    const startObservable$ = from(this.getTraderBusinessImages(traderId));

    const returnObservable$ = startObservable$.pipe(
      flatMap((images) =>
        from(Promise.all<string>(images.map((image) => image.getDownloadURL())))
      )
    );

    return returnObservable$;
  }

  getTraderBusinessImageThumbnailsUrls(
    traderId: string
  ): Observable<Array<string>> {
    const startObservable$ = from(
      this.getTraderBusinessImageThumbnails(traderId)
    );

    const returnObservable$ = startObservable$.pipe(
      flatMap((images) =>
        from(Promise.all<string>(images.map((image) => image.getDownloadURL())))
      )
    );

    return returnObservable$;
  }
}
