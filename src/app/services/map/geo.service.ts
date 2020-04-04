import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { GeocoderService } from './geocoder.service';

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

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private geocoderService: GeocoderService
  ) {
    this.geoFire = new GeoFirestore(db.firestore);
    this.locations = this.geoFire.collection('locations');
  }

  createLocation(traderId: string, coords: Array<number>) {
    return this.locations
      .doc(traderId)
      .set({
        coordinates: new firestore.GeoPoint(coords[0], coords[1]),
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async createLocationByDetails(
    traderId: string,
    zip: string,
    city: string,
    street: string,
    houseNumber: string,
    country: string = null
  ) {
    const geoCoordinates = await this.geocoderService
      .getCoordinates$(zip, city, street, houseNumber, country)
      .toPromise();

    if (geoCoordinates && geoCoordinates.length > 0) {
      return this.createLocation(traderId, geoCoordinates);
    }
  }

  async createLocationByAddress(traderId: string, address: string) {
    const ll = await this.geocoderService
      .findCoordinatesByAddress(address)
      .toPromise();

    if (ll && ll.length > 0) {
      return this.createLocation(traderId, ll);
    }
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius,
    });

    return query.get();
  }

  getUserPosition(): Observable<Array<number>> {
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
}
