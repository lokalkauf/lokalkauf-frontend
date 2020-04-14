import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';

import { BehaviorSubject, Observable } from 'rxjs';
import { GeoCollectionReference, GeoFirestore, GeoQuery } from 'geofirestore';
import { firestore } from 'firebase';
import { GeoAddress } from '../models/geoAddress';
import { TraderProfile } from '../models/traderProfile';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  dbRef: any;
  geoFire: GeoFirestore;
  locations: GeoCollectionReference;
  hits = new BehaviorSubject([]);
  urlEncoder = new HttpUrlEncodingCodec();

  constructor(db: AngularFirestore, private http: HttpClient) {
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

  async createLocationByAddress(
    traderId: string,
    trader: Partial<TraderProfile>
  ) {
    const searchAddress = trader.postcode;
    const addresses = await this.findCoordinatesByFullAddressWithFallback(
      trader.postcode,
      trader.city,
      trader.street,
      trader.number + ''
    );

    if (addresses) {
      return this.createLocation(traderId, addresses.coordinates);
    }
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
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
    return this.http
      .get(
        'https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=' +
          encodeURIComponent(searchString) +
          '&facet=note&facet=plz'
      )
      .pipe(
        map((addresses: any) => {
          if (
            !(addresses && addresses.records && addresses.records.length > 0)
          ) {
            return [];
          }

          return addresses.records.map((record) => ({
            postalcode: record.fields.plz,
            city: record.fields.note,
            coordinates: record.fields.geo_point_2d,
          }));
        })
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

  async findCoordinatesByFullAddressWithFallback(
    postal: string,
    city: string,
    street: string,
    streetnumber: string
  ): Promise<GeoAddress> {
    const streetcontent = (street ? street + ' ' + streetnumber : '').trim();
    const postalcitycontent = (postal + ' ' + city).trim();
    let searchFor = (postalcitycontent + ' ' + streetcontent).trim();
    let result = await this.findCoordinatesByFullAddress(searchFor);

    // fallback to postal and city only
    if (!result && streetcontent) {
      searchFor = postalcitycontent;
      result = await this.findCoordinatesByFullAddress(searchFor);
    }

    return result;
  }

  // nominatim service, be careful, 1 request per second is the limit
  async findCoordinatesByFullAddress(address: string): Promise<GeoAddress> {
    if (!address) {
      return null;
    }

    const response: any = await this.http
      .get(
        'https://nominatim.openstreetmap.org/?addressdetails=1&format=json&limit=1&q=' +
          encodeURIComponent(address.trim())
      )
      .toPromise();

    if (response && response.length > 0) {
      const res = response[0];
      return {
        city: res.address.town ? res.address.town : res.address.city,
        postalcode: res.address.postcode,
        coordinates: [Number(res.lat), Number(res.lon)],
        radius: 0,
      };
    }

    return null;
  }

  async getPostalAndCityByLocation(
    location: Array<number>
  ): Promise<GeoAddress> {
    if (location[0] === location[1] && location[0] === -1) {
      return null;
    }

    const loc = encodeURIComponent(location[0] + ',' + location[1]);
    const url =
      'https://api.opencagedata.com/geocode/v1/json?key=8cf06bcf900d48fdb16f767a6a0e5cd8&q=' +
      loc +
      '&pretty=1&no_annotations=1';

    const response: any = await this.http.get(url).toPromise();

    if (response) {
      return {
        city: response.results[0].components.town
          ? response.results[0].components.town
          : response.results[0].components.city
          ? response.results[0].components.city
          : response.results[0].components.village,
        postalcode: response.results[0].components.postcode,
        coordinates: location,
        radius: 0,
      };
    }

    // const response: any = await this.http
    //   .get('https://nominatim.openstreetmap.org/reverse', {
    //     params: {
    //       lat: location[0].toString(),
    //       lon: location[1].toString(),
    //       format: 'json',
    //     },
    //   })
    //   .toPromise();

    // if (response) {
    //   return {
    //     city: response.address.town
    //       ? response.address.town
    //       : response.address.city,
    //     postalcode: response.address.postcode,
    //     coordinates: location,
    //     radius: 0,
    //   };
    // }

    return null;
  }
}
