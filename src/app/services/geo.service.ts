import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';
import {
  GeoCollectionReference,
  GeoFirestore,
  GeoQuery,
  GeoQuerySnapshot,
} from 'geofirestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  dbRef: any;
  geoFire: GeoFirestore;

  locations: GeoCollectionReference;

  hits = new BehaviorSubject([]);

  constructor(private db: AngularFirestore) {
    this.geoFire = new GeoFirestore(db.firestore);
    this.locations = this.geoFire.collection('locations');
  }

  setLocation(key: string, coords: Array<number>) {
    this.locations.add({
      name: 'my-location',
      coordinates: new firestore.GeoPoint(coords[0], coords[1]),
    });
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius: radius,
    });

    return query.get();

    // .then((value: GeoQuerySnapshot) => {
    //   console.log(value.docs);
    // });
  }

  getUserPosition(clbk: any) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(clbk);
    }
  }
}
