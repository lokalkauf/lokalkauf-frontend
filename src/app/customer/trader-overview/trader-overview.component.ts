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
import {
  TraderProfile,
  TraderProfileStatus,
} from 'src/app/models/traderProfile';

@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component2.html',
  styleUrls: ['./trader-overview.component.scss'],
})
export class TraderOverviewComponent implements OnInit {
  traders$: Array<TraderProfile> = new Array<TraderProfile>();

  STATIC_LOCATION: number[] = [50.083352, 8.241451]; // 51.54136, 7.687467
  STATIC_RADIUS = 10;

  locations: Array<Location>;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      try {
        const pos = [
          Number.parseFloat(params.lat),
          Number.parseFloat(params.lng),
        ];
        // this.geo.setUserPosition(pos);

        this.loadTmpLocations(pos);
      } catch {
        console.log('no location available');
      }
    });
  }

  loadTmpLocations(position: number[]) {
    this.geo
      .getLocations(this.STATIC_RADIUS, position)
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
        this.updateLocations(this.locations);
      });
  }

  updateLocations(trlocaitons: Array<Location>) {
    this.traders$ = new Array<TraderProfile>();

    if (!trlocaitons || trlocaitons.length < 1) {
      return;
    }

    const distinctLocations = trlocaitons.filter(
      (thing, i, arr) =>
        arr.findIndex((t) => t.traderId === thing.traderId) === i
    );

    // a lot of magic, couse of firebase limitation loading 10 ids in query at once
    const ids = distinctLocations.map((l) => l.traderId);
    const chunked = this.getChunks(ids, 2);

    for (const chunk of chunked) {
      this.traderService
        .getTraderProfiles(chunk, TraderProfileStatus.PUBLIC)
        .subscribe((t: TraderProfile[]) => {
          if (t && t.length > 0) {
            t.forEach((trader) => {
              if (
                !this.traders$.find(
                  (f) =>
                    f.businessname === trader.businessname &&
                    f.city === trader.city &&
                    f.postcode === trader.postcode
                )
              ) {
                this.traders$.push(trader);
              }
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
