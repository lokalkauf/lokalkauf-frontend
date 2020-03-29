import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trader } from '../../models/trader';
import { Location } from 'src/app/models/location';
import { ActivatedRoute } from '@angular/router';

import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { GeoService } from 'src/app/services/geo.service';
import { TraderService } from 'src/app/services/trader.service';
import { TraderProfile } from 'src/app/models/traderProfile';

@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component2.html',
  styleUrls: ['./trader-overview.component.scss'],
})
export class TraderOverviewComponent implements OnInit {
  traders$: Array<TraderProfile> = new Array<TraderProfile>();

  STATIC_LOCATION: number[] = [51.54136, 7.687467]; // 50.083352, 8.241451
  STATIC_RADIUS = 10;

  locations: Array<Location>;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService
  ) {}

  ngOnInit() {
    this.loadTmpLocations();

    return;

    this.route.params.subscribe((params) => {
      console.log('lat' + params.lat + ' lng: ' + params.lng);

      try {
        const pos = [
          Number.parseFloat(params.lat),
          Number.parseFloat(params.lng),
        ];
        this.geo.setUserPosition(pos);
      } catch {
        console.log('no location available');
      }
    });
  }

  loadTmpLocations() {
    this.geo
      .getLocations(this.STATIC_RADIUS, this.STATIC_LOCATION)
      .then((value: GeoQuerySnapshot) => {
        this.locations = new Array<Location>();

        value.forEach((loc: GeoFirestoreTypes.QueryDocumentSnapshot) => {
          this.locations.push({
            traderId: loc.id,
            coordinates: [
              loc.data().coordinates.latitude,
              loc.data().coordinates.longitude,
            ],
            distance: loc.distance,
          });
        });
      })
      .finally(() => {
        console.log('loaded locations..');
        console.log(this.locations);
        this.updateLocations(this.locations);
      });
  }

  updateLocations(trlocaitons: Array<Location>) {
    if (!trlocaitons || trlocaitons.length < 1) {
      return;
    }

    console.log('UÖDATESASDFADF: ' + trlocaitons.length);

    // a lot of magic, couse of firebase limitation loading 10 ids in query at once
    const ids = trlocaitons.map((l) => l.traderId);
    const chunked = this.getChunks(ids, 10);
    console.log(chunked);

    this.traders$.forEach((t) => {
      this.traders$.pop();
    });

    this.traders$ = new Array<TraderProfile>();

    console.log('traders removed: ' + this.traders$.length);

    for (const chunk of chunked) {
      this.traderService
        .getTraderProfiles(chunk)
        .subscribe((t: TraderProfile[]) => {
          console.log('loading of trader done.');
          if (t && t.length > 0) {
            console.log('trader loaded: ' + t.length);

            t.forEach((trader) => {
              this.traders$.push(trader);
            });
          }
        });
    }
  }

  getChunks(arr, size) {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) {
        acc.push(arr.slice(i, i + size));
      }

      return acc;
    }, []);
  }
}
