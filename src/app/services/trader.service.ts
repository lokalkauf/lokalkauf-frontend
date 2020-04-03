import { Injectable, Query } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, FieldPath } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable, combineLatest, of, from } from 'rxjs';
import { map, switchMap, flatMap } from 'rxjs/operators';
import { TraderProfile, TraderProfileStatus } from '../models/traderProfile';
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

  getTraderProfile(id: string) {
    return this.db.collection('Traders').doc<TraderProfile>(id).valueChanges();
  }

  getTraderProfiles(
    traderIds: Array<string>,
    status: TraderProfileStatus
  ): Observable<Array<TraderProfile>> {
    return this.db
      .collection<TraderProfile>('Traders', (ref) =>
        ref
          .where(firestore.FieldPath.documentId(), 'in', traderIds)
          .where('status', '==', status)
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

  async updateTraderThumbnailUrl(traderId: string, url: string) {
    await this.db.collection('Traders').doc(traderId).update({
      thumbnailUrl: url,
    });
  }

  async updateTraderProfileStatus(
    traderId: string,
    newStatus: TraderProfileStatus
  ) {
    await this.db.collection('Traders').doc(traderId).update({
      status: newStatus,
    });
  }
}
