import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TraderProfile, TraderProfileStatus } from '../models/traderProfile';
import { GeoService } from './geo.service';

@Injectable({
  providedIn: 'root',
})
export class TraderService {
  constructor(private db: AngularFirestore, private geo: GeoService) {}

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

  async getTraderProfiles(
    traderIds: Array<string>,
    status: TraderProfileStatus
  ): Promise<Array<TraderProfile>> {
    const chunks = this.getChunks(traderIds, 10);

    const snapshots = await Promise.all(
      chunks.map((chunk) =>
        this.db
          .collection<Omit<TraderProfile, 'id'>>('Traders')
          .ref.where(firestore.FieldPath.documentId(), 'in', chunk)
          .where('status', '==', status)
          .get()
      )
    );

    const docs = snapshots.reduce(
      (combined, snapshot) => combined.concat(snapshot.docs),
      [] as firestore.QueryDocumentSnapshot<firestore.DocumentData>[]
    );

    return docs.map((doc) => ({
      ...(doc.data() as Omit<TraderProfile, 'id'>),
      id: doc.id,
    })) as TraderProfile[];
  }

  async updateTraderProfileStatus(
    traderId: string,
    newStatus: TraderProfileStatus
  ) {
    await this.db.collection('Traders').doc(traderId).update({
      status: newStatus,
    });
  }

  async updateTraderProfile(
    partialTraderProfile: Partial<TraderProfile>,
    traderId: string
  ) {
    await this.db
      .doc<TraderProfile>(`Traders/${traderId}`)
      .update(partialTraderProfile);

    if (partialTraderProfile.postcode) {
      await this.geo.createLocationByAddress(traderId, partialTraderProfile);
    }
  }

  private getChunks<T>(arr: T[], size: number): T[][] {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) {
        acc.push(arr.slice(i, i + size));
      }

      return acc;
    }, []);
  }
}
