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
  traders: TraderProfile[] = [];

  STATIC_LOCATION: number[] = [50.083352, 8.241451]; // 51.54136, 7.687467
  STATIC_RADIUS = 10;
  paramRadius: number;

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
        this.paramRadius = Number.parseFloat(params.rad);
        this.loadTmpLocations(pos);
      } catch {
        console.log('no location available');
      }
    });
  }

  loadTmpLocations(position: number[]) {
    const radius = this.paramRadius ? this.paramRadius : this.STATIC_RADIUS;
    this.geo
      .getLocations(radius, position)
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

  async updateLocations(trlocaitons: Array<Location>) {
    if (!trlocaitons || trlocaitons.length < 1) {
      return;
    }

    const distinctLocations = trlocaitons.filter(
      (thing, i, arr) =>
        arr.findIndex((t) => t.traderId === thing.traderId) === i
    );

    const ids = distinctLocations.map((l) => l.traderId);

    const traderProfiles = await this.traderService.getTraderProfiles(
      ids,
      TraderProfileStatus.PUBLIC
    );

    this.traders = traderProfiles.sort((traderA, traderB) =>
      traderA.businessname.localeCompare(traderB.businessname)
    );
  }
}
