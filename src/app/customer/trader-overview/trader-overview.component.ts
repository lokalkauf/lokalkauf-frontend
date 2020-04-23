import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location } from '../../models/location';
import { ActivatedRoute } from '@angular/router';
import { LkSelectOptions } from '../../reusables/lk-select/lk-select.component';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { GeoService } from '../../services/geo.service';
import { TraderService } from '../../services/trader.service';
import { TraderProfile, TraderProfileStatus } from '../../models/traderProfile';
import { SpinnerService } from '../../services/spinner.service';
import { map, filter } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { uiTexts } from 'src/app/services/uiTexts';
import {
  faFacebookF,
  faTwitter,
  faWhatsapp,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { functions } from 'firebase';

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
  selectedTrader: LkSelectOptions;
  storeTypes: Observable<LkSelectOptions[]>;
  storeTypePreselect: Observable<string>;

  hasLocations$: Observable<boolean> = of(true);
  faFacebookF = faFacebookF;
  faTwitter = faTwitter;
  faWhatsapp = faWhatsapp;
  faInstagram = faInstagram;
  text = uiTexts;
  constructor(
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService,
    private spinnerService: SpinnerService,
    private readonly storageService: StorageService
  ) {
    this.selectedTrader = this.storageService.loadTraderFilter();
    if (this.selectedTrader) {
      this.storeType = this.selectedTrader.value;
    }

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
    const data = {
      radius,
      coords: position,
    };
    const getTraders = functions().httpsCallable(`locationByDistance`);

    getTraders
      .call('Get Traders', data)
      .then((value) => {
        this.locations = new Array<Location>();

        value.data.forEach((loc: GeoFirestoreTypes.QueryDocumentSnapshot) => {
          this.locations.push({
            traderId: loc.id,
            coordinates: [],
            distance: loc.distance,
          });
        });
      })
      .finally(() => {
        this.updateLocations(this.locations);
        this.spinnerService.hide();
      });
  }

  selChange(selEvent: LkSelectOptions) {
    if (selEvent) {
      console.log(selEvent);
      this.storeType = selEvent.value;
      this.storageService.saveTraderFilter(selEvent);
      this.updateLocations(this.locations);
    }
  }

  async updateLocations(trlocaitons: Array<Location>) {
    if (!trlocaitons || trlocaitons.length < 1) {
      this.hasLocations$ = of(false);
      return;
    }

    const distinctLocations = trlocaitons
      .sort((a, b) => a.distance - b.distance)
      .filter(
        (thing, i, arr) =>
          arr.findIndex((t) => t.traderId === thing.traderId) === i
      );

    const ids = distinctLocations.map((l) => l.traderId);

    const traderProfiles = await this.traderService.getTraderProfiles(
      ids,
      TraderProfileStatus.PUBLIC
    );

    const traderArray = traderProfiles as Array<any>;

    for (const traderRow of traderProfiles) {
      for (const distinctRow of distinctLocations) {
        if (distinctRow.traderId === traderRow.id) {
          traderRow.currentDistance = distinctRow.distance;
        }
      }
    }

    this.hasLocations$ = of(traderProfiles.length > 0);

    if (this.storeType && this.storeType !== 'alle') {
      const selectedStores = [];
      traderProfiles.filter((i) => {
        if (i.storeType && i.storeType[this.storeType]) {
          selectedStores.push(i);
        }
      });
      this.traders = selectedStores.sort(
        (traderA, traderB) => traderA.currentDistance - traderB.currentDistance
      );
    } else {
      this.traders = traderProfiles.sort(
        (traderA, traderB) => traderA.currentDistance - traderB.currentDistance
      );
    }
  }
}
