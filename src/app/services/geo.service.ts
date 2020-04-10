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
import { GeoAddress } from '../models/geoAddress';

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

  async createLocationByAddress(traderId: string, address: string) {
    const ll = await this.findCoordinatesByAddress(address)
      .pipe(map((r) => r.records.map((m) => m.fields)))
      .toPromise();

    if (ll && ll.length > 0) {
      return this.createLocation(traderId, ll[0].geo_point_2d);
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

  findCoordinatesByAddress(searchString: string): Observable<any> {
    return this.http.get(
      'https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=' +
        encodeURIComponent(searchString) +
        '&facet=note&facet=plz'
    );

    // "records":[
    //   {
    //     "datasetid":"postleitzahlen-deutschland",
    //     "recordid":"16a2fa27f5f8ac99ea043808ec16591ef21c6ee4",
    //     "fields": {
    //       "note":"Dortmund",
    //       "geo_shape": {
    //         "type":"Polygon",
    //         "coordinates":[
    //           [(too many elements to preview)]
    //         ]
    //       },
    //       "geo_point_2d":[
    //         51.51248317666277,
    //         7.374578158476884
    //       ],
    //       "plz":"44379"
    //     },
    //     "geometry": {
    //       "type":"Point",
    //       "coordinates":[
    //         7.374578158476884,
    //         51.51248317666277
    //       ]
    //     },
    //     "record_timestamp":"2017-03-25T06:26:36.889000+00:00"
    //   }]
  }

  async getPostalAndCityByLocation(
    location: Array<number>
  ): Promise<GeoAddress> {
    const loc = encodeURIComponent(location[0] + ',' + location[1]);
    const url =
      'https://api.opencagedata.com/geocode/v1/json?key=8cf06bcf900d48fdb16f767a6a0e5cd8&q=' +
      loc +
      '&pretty=1&no_annotations=1';

    const response: any = await this.http.get(url).toPromise();

    if (response) {
      return {
        city: response.results[0].components.city,
        postalcode: response.results[0].components.postcode,
        coordinates: location,
      };
    }

    return null;
  }
}
