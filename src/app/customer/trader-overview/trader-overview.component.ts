import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject, from } from 'rxjs';
import { Location } from '../../models/location';
import { ActivatedRoute } from '@angular/router';
import { LkSelectOptions } from '../../reusables/lk-select/lk-select.component';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { GeoService } from '../../services/geo.service';
import { TraderService } from '../../services/trader.service';
import { TraderProfile, TraderProfileStatus } from '../../models/traderProfile';
import { SpinnerService } from '../../services/spinner.service';
import { map, filter } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';
import { uiTexts } from '../../services/uiTexts';
import {
  faFacebookF,
  faTwitter,
  faWhatsapp,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { functions } from 'firebase';
import { FormControlName, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LocationService } from '../../services/location.service';
import { ImageService } from 'src/app/services/image.service';

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

  rangeChanging$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  userPosition: number[];

  get range() {
    return this.rangeGroup.get('range');
  }

  rangeGroup = new FormGroup({
    range: new FormControl(0),
  });

  constructor(
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService,
    private spinnerService: SpinnerService,
    private readonly storageService: StorageService,
    public userService: UserService,
    private locationService: LocationService,
    private imageService: ImageService
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

    this.rangeGroup.get('range').valueChanges.subscribe((value) => {
      const location = this.storageService.loadLocation();
      if (location && location.coordinates) {
        this.paramRadius = value;
        location.radius = value;
        // this.loadTmpLocations(location.coordinates);
        this.storageService.saveLocation(location);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      try {
        this.userPosition = [
          Number.parseFloat(params.lat),
          Number.parseFloat(params.lng),
        ];
        // this.geo.setUserPosition(pos);
        this.paramRadius = Number.parseFloat(params.rad);
        this.setRange(this.paramRadius);
        this.rangeGroup
          .get('range')
          .setValue(this.paramRadius, { emitEvent: false, onlySelf: true });
        // this.loadTmpLocations(pos);
        this.loadLocations();
      } catch {
        console.log('no location available');
      }
    });
  }

  loadLocations() {
    this.locationService
      .nearBy(this.paramRadius, this.userPosition, this.getCategoryFilter())
      .then((result: any) => {
        this.locations = result.data.locations;
        console.log('locations received: ' + this.locations);

        this.hasLocations$ = of(!!this.locations && this.locations.length > 0);

        if (this.locations) {
          this.locations.forEach(async (l: any) => {
            // load thumbnails...
            l.thumbnailURL = await await this.imageService.getThumbnailUrl(
              l.defaultImagePath
            );

            if (!l.thumbnailURL) {
              l.thumbnailURL = '/assets/lokalkauf-pin.svg';
            }
          });
        }
      })
      .catch((e) => {
        console.log('error: ' + e);
      });
  }

  setRange(val: number) {
    this.rangeChanging$.next(val);

    this.loadLocations();
  }

  setStoreType(selEvent: LkSelectOptions) {
    if (selEvent) {
      console.log(selEvent);
      this.storeType = selEvent.value;
      this.storageService.saveTraderFilter(selEvent);

      this.loadLocations();
      // this.updateLocations(this.locations);
    }
  }

  getCategoryFilter() {
    return {
      categories:
        !this.storeType || this.storeType === 'alle' ? [] : [this.storeType],
    };
  }

  // loadTmpLocations(position: number[]) {
  //   this.spinnerService.show();
  //   const radius = this.paramRadius ? this.paramRadius : this.STATIC_RADIUS;
  //   const data = {
  //     radius,
  //     coords: position,
  //   };
  //   const getTraders = functions().httpsCallable(`locationByDistance`);

  //   getTraders
  //     .call('Get Traders', data)
  //     .then((value) => {
  //       this.locations = new Array<Location>();

  //       value.data.forEach((loc: GeoFirestoreTypes.QueryDocumentSnapshot) => {
  //         this.locations.push({
  //           traderId: loc.id,
  //           coordinates: [],
  //           distance: loc.distance,
  //         });
  //       });
  //     })
  //     .finally(() => {
  //       this.updateLocations(this.locations);
  //       this.spinnerService.hide();
  //     });
  // }

  // async updateLocations(trlocaitons: Array<Location>) {
  //   if (!trlocaitons || trlocaitons.length < 1) {
  //     this.hasLocations$ = of(false);
  //     return;
  //   }

  //   const distinctLocations = trlocaitons
  //     .sort((a, b) => a.distance - b.distance)
  //     .filter(
  //       (thing, i, arr) =>
  //         arr.findIndex((t) => t.traderId === thing.traderId) === i
  //     );

  //   const ids = distinctLocations.map((l) => l.traderId);

  //   const traderProfiles = await this.traderService.getTraderProfiles(
  //     ids,
  //     TraderProfileStatus.PUBLIC
  //   );

  //   const traderArray = traderProfiles as Array<any>;

  //   for (const traderRow of traderProfiles) {
  //     for (const distinctRow of distinctLocations) {
  //       if (distinctRow.traderId === traderRow.id) {
  //         traderRow.currentDistance = distinctRow.distance;
  //       }
  //     }
  //   }

  //   this.hasLocations$ = of(traderProfiles.length > 0);

  //   if (this.storeType && this.storeType !== 'alle') {
  //     const selectedStores = [];
  //     traderProfiles.filter((i) => {
  //       if (i.storeType && i.storeType[this.storeType]) {
  //         selectedStores.push(i);
  //       }
  //     });
  //     this.traders = selectedStores.sort(
  //       (traderA, traderB) => traderA.currentDistance - traderB.currentDistance
  //     );
  //   } else {
  //     this.traders = traderProfiles.sort(
  //       (traderA, traderB) => traderA.currentDistance - traderB.currentDistance
  //     );
  //   }
  // }
}
