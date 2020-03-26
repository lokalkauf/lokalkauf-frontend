import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
//import {GeoFire, GeoFireTypes } from "geofire";
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
  // Create a GeoCollection reference
  locations: GeoCollectionReference;
  //  types:GeoFireTypes.firebase.Reference;

  hits = new BehaviorSubject([]);

  constructor(private db: AngularFirestore) {
    this.geoFire = new GeoFirestore(db.firestore);
    this.locations = this.geoFire.collection('locations');
    //var dbRef = this.db.collection('locations');
    //this.geoFire = new GeoFire(dbRef.doc("geofire").ref);

    // this.setLocation("a1", [51.540832, 7.687659]);
    // this.setLocation("a2", [51.542142, 7.692150]);
    // this.setLocation("a3", [51.531831, 7.690650]);
  }

  setLocation(key: string, coords: Array<number>) {
    this.locations.add({
      name: 'my-location',
      coordinates: new firestore.GeoPoint(coords[0], coords[1]),
    });

    // this.geoFire.set(key, coords)
    //             .then(_ => console.log('location updated'))
    //             .catch(err => console.log(err));
  }

  getLocations(radius: number, coords: Array<number>) {
    const query: GeoQuery = this.locations.near({
      center: new firestore.GeoPoint(coords[0], coords[1]),
      radius: radius,
    });

    query.get().then((value: GeoQuerySnapshot) => {
      console.log(value.docs);
    });

    // this.geoFire.query({
    //   cneter:coords,
    //   radius:radius
    // })
    // .on('key_entered', (key, location, distance) => {
    //     let hit = {
    //       location:location,
    //       distance:distance
    //     }

    //     let currentHits = this.hits.value;
    //     currentHits.push(hit);
    //     this.hits.next(currentHits);
    // })
  }
}
