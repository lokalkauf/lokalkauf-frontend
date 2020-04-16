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

  constructor(private db: AngularFirestore, private http: HttpClient) {
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
    if (!searchString) {
      return null;
    }

    const isSearchPostal = !isNaN(Number(searchString.substring(0, 1)));
    const search = searchString.toLowerCase();
    const arr = isSearchPostal ? 'd.postal_arr' : 'd.city_arr';

    return from(
      this.db
        .collection('GeoData')
        .ref.orderBy('d.postalcode')
        .where(arr, 'array-contains', search)
        .get()
    ).pipe(
      map((a) =>
        a.docs.map((d) => {
          const data = d.data();
          return {
            city: data.d.city,
            postalcode: data.d.postalcode,
            coordinates: [
              data.d.coordinates.latitude,
              data.d.coordinates.longitude,
            ],
          } as GeoAddress;
        })
      )
    );

    // return this.http
    //   .get(
    //     'https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=' +
    //       encodeURIComponent(searchString) +
    //       '&facet=note&facet=plz'
    //   )
    //   .pipe(
    //     map((addresses: any) => {
    //       if (
    //         !(addresses && addresses.records && addresses.records.length > 0)
    //       ) {
    //         return [];
    //       }

    //       return addresses.records.map((record) => ({
    //         postalcode: record.fields.plz,
    //         city: record.fields.note,
    //         coordinates: record.fields.geo_point_2d,
    //       }));
    //     })
    //   );

    // // "records":[
    // //   {
    // //     "datasetid":"postleitzahlen-deutschland",
    // //     "recordid":"16a2fa27f5f8ac99ea043808ec16591ef21c6ee4",
    // //     "fields": {
    // //       "note":"Dortmund",
    // //       "geo_shape": {
    // //         "type":"Polygon",
    // //         "coordinates":[
    // //           [(too many elements to preview)]
    // //         ]
    // //       },
    // //       "geo_point_2d":[
    // //         51.51248317666277,
    // //         7.374578158476884
    // //       ],
    // //       "plz":"44379"
    // //     },
    // //     "geometry": {
    // //       "type":"Point",
    // //       "coordinates":[
    // //         7.374578158476884,
    // //         51.51248317666277
    // //       ]
    // //     },
    // //     "record_timestamp":"2017-03-25T06:26:36.889000+00:00"
    // //   }]
  }

  async getPostalAndCityByLocation(
    location: Array<number>
  ): Promise<GeoAddress> {
    if (location[0] === location[1] && location[0] === -1) {
      return null;
    }

    const items = await this.geoPostalcodes
      .near({
        center: new firestore.GeoPoint(location[0], location[1]),
        radius: 20,
      })
      .limit(8)
      .get();

    // console.log('item: ' + items.size);

    if (items.size > 0) {
      for (const i of items.docs) {
        const data = i.data();
        const postalShape = JSON.parse(data.shape);

        const inside = insidepolygon(
          location.reverse(),
          postalShape.coordinates[0]
        );

        if (inside) {
          // console.log(data.postalcode + ' ' + data.city + ' is in: ' + inside);
          // console.log('coordinates: ' + data.coordinates);
          // console.log(data.coordinates);

          return {
            city: data.city,
            postalcode: data.postalcode,
            coordinates: [
              data.coordinates.latitude,
              data.coordinates.longitude,
            ],
            radius: 0,
          };
        }
      }

      //    var sortedItems = items.docs.sort((a,b) => a.distance - b.distance);

      //    sortedItems.forEach(i => {
      //                     console.log('ready: ' + i.id + ' distance: ' + i.distance);
      //   });

      //     console.log('MEIN ORT: ' + sortedItems[0].data().postalcode + ' ' +  sortedItems[0].data().city);
    }

    // const loc = encodeURIComponent(location[0] + ',' + location[1]);
    // const url =
    //   'https://api.opencagedata.com/geocode/v1/json?key=8cf06bcf900d48fdb16f767a6a0e5cd8&q=' +
    //   loc +
    //   '&pretty=1&no_annotations=1';

    // const response: any = await this.http.get(url).toPromise();

    // if (response) {
    //   return {
    //     city: response.results[0].components.town
    //       ? response.results[0].components.town
    //       : response.results[0].components.city
    //       ? response.results[0].components.city
    //       : response.results[0].components.village,
    //     postalcode: response.results[0].components.postcode,
    //     coordinates: location,
    //     radius: 0,
    //   };
    // }

    return null;
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
}
