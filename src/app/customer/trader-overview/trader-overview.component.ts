import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from 'src/app/models/location';
import { ActivatedRoute } from '@angular/router';
import { LkSelectOptions } from 'src/app/reusables/lk-select/lk-select.component';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { GeoService } from 'src/app/services/geo.service';
import { TraderService } from 'src/app/services/trader.service';
import {
  TraderProfile,
  TraderProfileStatus,
} from 'src/app/models/traderProfile';
import { SpinnerComponent } from 'src/app/spinner/spinner.component';
import { SpinnerService } from 'src/app/services/spinner.service';

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
  storeType: string;
  locations: Array<Location>;

  storeTypes: Observable<LkSelectOptions[]>;
  storeTypePreselect: Observable<string>;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService,
    private spinnerService: SpinnerService
  ) {
    this.storeTypePreselect = of('Nach was bist du auf der Suche?');
    this.storeTypes = of([
      {
        key: '1',
        display: 'Alle',
        value: 'alle',
      },
      {
        key: '2',
        display: 'Gastronomie',
        value: 'gastronomie',
      },
      {
        key: '3',
        display: 'Lebensmittel',
        value: 'lebensmittel',
      },
      {
        key: '4',
        display: 'Fashion',
        value: 'fashion',
      },
      {
        key: '5',
        display: 'Buchhandlung',
        value: 'buchhandlung',
      },
      {
        key: '6',
        display: 'Home & Decor',
        value: 'homedecor',
      },
      {
        key: '7',
        display: 'Blumen & Garten',
        value: 'blumengarten',
      },
      {
        key: '8',
        display: 'Handwerk',
        value: 'handwerk',
      },
      {
        key: '9',
        display: 'Sonstiges',
        value: 'sonstiges',
      },
    ]);
  }

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

  reducedAction(val: any) {
    if (val.internalValue) {
      this.storeType = val.intValue;
      this.updateLocations(this.locations);
    }
  }

  loadTmpLocations(position: number[]) {
    this.spinnerService.show();
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
        this.spinnerService.hide();
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

    if (this.storeType && this.storeType !== 'alle') {
      const selectedStores = [];
      traderProfiles.filter((i) => {
        if (i.storeType && i.storeType[this.storeType]) {
          selectedStores.push(i);
        }
      });
      this.traders = selectedStores.sort((traderA, traderB) =>
        traderA.businessname.localeCompare(traderB.businessname)
      );
    } else {
      this.traders = traderProfiles.sort((traderA, traderB) =>
        traderA.businessname.localeCompare(traderB.businessname)
      );
    }
  }
}
