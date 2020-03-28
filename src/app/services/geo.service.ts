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
    console.log('set locaiton: ' + traderId + 'crds ' + coords);

    this.locations
      .add(
        {
          traderId,
          coordinates: new firestore.GeoPoint(coords[0], coords[1]),
        },
        traderId
      )
      .catch((e) => {
        console.log(e);
      });
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius,
    });

    return query.get();
  }

  getUserPosition(): Observable<any> {
    return new Observable((observer) => {
      let currentPos = this.manuelUserPosition;

      if (currentPos && currentPos[0] === 0 && currentPos[1] === 0) {
        currentPos = null;
      }

      if (!currentPos && navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            currentPos = [position.coords.latitude, position.coords.longitude];
            observer.next(currentPos);
            observer.complete();
          },
          (error) => {
            observer.next(currentPos);
            observer.complete();
          }
        );
      } else {
        observer.next(currentPos);
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
  }

  getPostalAndCityByLocation(location: Array<number>) {
    const loc = encodeURIComponent(location[0] + ',' + location[1]);
    const url =
      'https://api.opencagedata.com/geocode/v1/json?key=8cf06bcf900d48fdb16f767a6a0e5cd8&q=' +
      loc +
      '&pretty=1&no_annotations=1';

    return this.http.get(url);
  }
}
