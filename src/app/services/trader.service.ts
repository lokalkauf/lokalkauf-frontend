import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TraderProfile, TraderProfileStatus } from '../models/traderProfile';

@Injectable({
  providedIn: 'root',
})
export class TraderService {
  constructor(private db: AngularFirestore) {}

  async createTraderProfile(id: string, trader: TraderProfile) {
    await this.db.collection('Traders').doc(id).set(trader);
  }

  getTraderProfile(id: string): Observable<TraderProfile> {
    return this.db
      .collection('Traders')
      .doc<Omit<TraderProfile, 'id'>>(id)
      .valueChanges()
      .pipe(
        map((tp) => ({
          ...tp,
          id,
        }))
      );
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

  async updateTraderProfileStatus(
    traderId: string,
    newStatus: TraderProfileStatus
  ) {
    await this.db.collection('Traders').doc(traderId).update({
      status: newStatus,
    });
  }
}
