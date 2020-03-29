import { Injectable, Query } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, FieldPath } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TraderProfile } from '../models/traderProfile';

@Injectable({
  providedIn: 'root',
})
export class TraderService {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

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
}
