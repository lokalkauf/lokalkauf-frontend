import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentData,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { map, timeout, flatMap } from 'rxjs/operators';
import insidepolygon from 'point-in-polygon';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { GeoCollectionReference, GeoFirestore, GeoQuery } from 'geofirestore';
import { firestore } from 'firebase';
import { GeoAddress } from '../models/geoAddress';
import { TraderProfile } from '../models/traderProfile';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  dbRef: any;
  geoFire: GeoFirestore;
  locations: GeoCollectionReference;
  geoPostalcodes: GeoCollectionReference;
  hits = new BehaviorSubject([]);
  urlEncoder = new HttpUrlEncodingCodec();

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.geoFire = new GeoFirestore(db.firestore);
    this.locations = this.geoFire.collection('locations');
    this.geoPostalcodes = this.geoFire.collection('GeoData');
  }

  createLocation(traderId: string, coords: Array<number>) {
    return this.locations
      .doc(traderId)
      .set({
        coordinates: new firestore.GeoPoint(coords[0], coords[1]),
      })
      .catch((e) => {});
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius,
    });

    return query.get();
  }

  getUserPosition(): Promise<Array<number | undefined>> {
    return new Promise((resolve) => {
      const cachedPosition = this.storage.loadUserPosition();

      if (cachedPosition) {
        resolve(cachedPosition);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = [position.coords.latitude, position.coords.longitude];
          this.storage.saveUserPosition(pos);
          resolve(pos);
        },
        (error) => {
          resolve(undefined);
        }
      );
    });
  }

  findCoordinatesByPostalOrCity(
    searchString: string
  ): Observable<GeoAddress[]> {
    if (!searchString) {
      return null;
    }

    const isSearchPostal = !isNaN(Number(searchString.substring(0, 1)));
    const search = searchString.toLowerCase().trim();
    const arr = isSearchPostal ? 'd.postal_arr' : 'd.city_arr';

    return from(
      this.db
        .collection('GeoData')
        .ref.orderBy('d.postalcode')
        .where(arr, 'array-contains', search)
        .get()
    ).pipe(
      map((a) => {
        const all = a.docs.map((d) => {
          const data = d.data();
          return {
            city: data.d.city,
            postalcode: data.d.postalcode,
            coordinates: [
              data.d.coordinates.latitude,
              data.d.coordinates.longitude,
            ],
          } as GeoAddress;
        });

        // add whole cities
        if (!isSearchPostal && all && all.length > 0) {
          const uniqueCities = this.distinctArray(all, 'city');
          if (uniqueCities) {
            uniqueCities.forEach((c) => {
              all.unshift({
                city: c.city + '',
                postalcode: '',
                coordinates: all.find((ct) => ct.city === c.city).coordinates,
                radius: 25,
              } as GeoAddress);
            });
          }
        }

        return all;
      })
    );
  }

  async getPostalAndCityByLocation(
    location: Array<number>
  ): Promise<GeoAddress | undefined> {
    if (!location || !location[0] || !location[1]) {
      return undefined;
    }

    // location = [52.2839641, 8.034344599999999];

    const items = await this.geoPostalcodes
      .near({
        center: new firestore.GeoPoint(location[0], location[1]),
        radius: 20,
      })
      .limit(8)
      .get();

    const locationInverted = location.reverse();

    if (items.size > 0) {
      for (const i of items.docs) {
        const data = i.data();
        const postalShape = JSON.parse(data.shape);

        const inside = insidepolygon(
          locationInverted,
          postalShape.coordinates[0]
        );

        if (inside) {
          return {
            city: data.city,
            postalcode: data.postalcode,
            coordinates: [
              data.coordinates.latitude,
              data.coordinates.longitude,
            ],
            radius: 10,
          };
        }
      }

      // fallback to the nearest center of a plz
      const theNext = items.docs
        .sort((a, b) => a.distance - b.distance)[0]
        .data();

      return {
        city: theNext.city,
        postalcode: theNext.postalcode,
        coordinates: location,
        radius: 10,
      };
    }

    return null;
  }

  // nominatim service, be careful, 1 request per second is the limit
  async findCoordinatesByFullAddress(
    postal: string,
    city: string,
    street: string,
    streetnumber: string
  ): Promise<GeoAddress> {
    let response: any = null;

    try {
      response = await this.http
        .get(
          'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
          {
            params: {
              Address: `${street} ${streetnumber}`,
              City: city,
              Postal: postal,
              CountryCode: 'de',
              f: 'pjson',
            },
          }
        )
        .toPromise();
    } catch (e) {}

    const candidate = response ? response.candidates?.[0] : null;
    if (!candidate) {
      return null;
    }

    return {
      city,
      postalcode: postal,
      coordinates: [candidate.location.y, candidate.location.x],
      radius: 0,
    };
  }

  distinctArray<T>(array: T[], propertyName: string) {
    if (array && array.length > 0) {
      return array.filter((item, i, arr) => {
        return (
          arr.indexOf(
            arr.find((t) => t[propertyName] === item[propertyName])
          ) === i
        );
      });
    }

    return array;
  }
}
