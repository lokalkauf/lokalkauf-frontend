import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { BehaviorSubject, Observable } from 'rxjs';
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
  urlEncoder = new HttpUrlEncodingCodec();
  manuelUserPosition: Array<number>;

  constructor(private db: AngularFirestore, private http: HttpClient) {
    this.geoFire = new GeoFirestore(db.firestore);
    this.locations = this.geoFire.collection('locations');
  }

  setLocation(traderId: string, coords: Array<number>) {
    this.locations.add({
      traderId:traderId,
      coordinates: new firestore.GeoPoint(coords[0], coords[1]),
    }, traderId);
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius,
    });

    return query.get();
  }

  getUserPosition(): Observable<any> {
    return Observable.create((observer) => {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            observer.complete();
          },
          (error) => {
            observer.next(this.manuelUserPosition);
            observer.complete();
          }
        );
      } else {
        observer.next(this.manuelUserPosition);
        observer.complete();
      }
    });
  }

  getManuellPosition() {
    return this.manuelUserPosition;
  }

  setUserPosition(pos: Array<number>) {
    this.manuelUserPosition = pos;
  }

  search(searchString: string) {
    return this.http
      .get(
        'https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=' +
          encodeURIComponent(searchString) +
          '&facet=note&facet=plz'
      )
      .toPromise();
    // .pipe(tap(
    //   data => console.log("d" + data),
    //   error => console.log("e" + error)

    // ));
  }
}
