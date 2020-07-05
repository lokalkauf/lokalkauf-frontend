import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Location } from '../../models/location';
import { ActivatedRoute } from '@angular/router';
import { LkSelectOptions } from '../../reusables/lk-select/lk-select.component';
import { TraderProfile } from '../../models/traderProfile';
import { StorageService } from '../../services/storage.service';
import { uiTexts } from '../../services/uiTexts';
import {
  faFacebookF,
  faTwitter,
  faWhatsapp,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LocationService } from '../../services/location.service';
import { ImageService } from 'src/app/services/image.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component2.html',
  styleUrls: ['./trader-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TraderOverviewComponent implements OnInit {
  traders: TraderProfile[] = [];

  STORE_TYPES = [
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
  ];
  paramRadius: number;
  storeType: string;
  locations: Array<Location>;
  selectedTraderCategory: LkSelectOptions;
  storeTypes: Observable<LkSelectOptions[]>;
  currentLocation: string;

  hasLocations$: Observable<boolean> = of(true);
  faFacebookF = faFacebookF;
  faTwitter = faTwitter;
  faWhatsapp = faWhatsapp;
  faInstagram = faInstagram;
  text = uiTexts;

  traderSearchForm = new FormGroup({
    searchText: new FormControl(''),
  });

  rangeChanging$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  userPosition: number[];
  hasInitLocations: boolean;

  get range() {
    return this.rangeGroup.get('range');
  }

  rangeGroup = new FormGroup({
    range: new FormControl(0),
  });
  constructor(
    private route: ActivatedRoute,
    public readonly storageService: StorageService,
    public userService: UserService,
    private locationService: LocationService,
    private imageService: ImageService,
    private spinnerService: SpinnerService,
    public device: DeviceDetectorService,
    private analytics: AngularFireAnalytics
  ) {
    this.storeTypes = of(this.STORE_TYPES);
    const currentLocation = this.storageService.loadLocation();
    if (currentLocation && currentLocation.city) {
      this.currentLocation = currentLocation.city;
      this.analytics.logEvent('searched_location', {
        city: this.currentLocation,
      });
    }
  }

  ngOnInit() {
    this.selectedTraderCategory = this.storageService.loadTraderFilter();
    if (this.selectedTraderCategory) {
      this.storeType = this.selectedTraderCategory.value;
    }

    this.rangeGroup.get('range').valueChanges.subscribe((value) => {
      const location = this.storageService.loadLocation();

      if (location && location.coordinates) {
        this.paramRadius = this.sanitizeRadius(value);
        location.radius = this.sanitizeRadius(value);

        this.storageService.saveLocation(location);

        this.loadLocations();
      }
    });

    this.route.params.subscribe((params) => {
      try {
        this.userPosition = [
          Number.parseFloat(params.lat),
          Number.parseFloat(params.lng),
        ];

        this.paramRadius = this.sanitizeRadius(Number.parseFloat(params.rad));
        this.setRange(this.paramRadius);
        this.rangeGroup
          .get('range')
          .setValue(this.paramRadius, { emitEvent: false, onlySelf: true });

        this.loadLocations();
      } catch {}
    });
  }

  async onTextSearchSubmit() {
    const textToSearchFor = this.traderSearchForm.get('searchText').value;
    if (textToSearchFor && textToSearchFor.length >= 3) {
      this.loadLocations(textToSearchFor);
    } else {
      console.log('mindestens 3 Zeichen eingeben');
    }
  }

  // the locations of the Traders are loaded here
  loadLocations(searchstring: string = '') {
    this.spinnerService.show();
    const filter = this.getCategoryFilter();

    // if the initial call has no results,
    // and a category from Session Storage
    // is isn't equals 'all', then try again with the
    // category 'all' to repeat the initial search process.
    if (!this.hasInitLocations && this.storeType !== 'alle') {
      this.selectedTraderCategory = this.STORE_TYPES[0];
      this.setStoreType(this.STORE_TYPES[0]);
      return;
    }

    this.locationService
      .nearBy(this.paramRadius, this.userPosition, searchstring, filter)
      .then((result: any) => {
        this.locations = result;
        if (this.locations && this.locations.length > 0) {
          // set hasLocations and hasinitialLocations to true, to hide the 'No results found' view
          this.hasLocations$ = of(true);
          this.hasInitLocations = true;

          // load thumbnails.
          // TODO: it makes no sense to load the thumbnailurl dynamically
          // from the DB. The public thumbnailURL should already be stored in the locations.
          // This should be refactored in one of the next iterations!
          this.locations.forEach(async (l: any) => {
            l.thumbnailURL = await this.imageService.getThumbnailUrl(
              l.defaultImagePath,
              '224x224'
            );

            if (!l.thumbnailURL) {
              l.thumbnailURL = '/assets/lokalkauf-pin.svg';
            }
          });
        } else {
          // Show "no result page" if no shops were found
          // but dont show it if filters are selected.
          // Otherwise the filter cant be unselected.
          if (filter.categories.length === 0) {
            this.hasLocations$ = of(false);
          }
        }
      })
      .catch((e) => {})
      .finally(() => {
        this.spinnerService.hide();
      });
  }

  setRange(val: number) {
    this.rangeChanging$.next(val);
    this.analytics.logEvent('searched_location', {
      city: this.currentLocation,
      range: val,
    });
  }

  setStoreType(selEvent: LkSelectOptions) {
    if (selEvent) {
      this.storeType = selEvent.value;
      this.storageService.saveTraderFilter(selEvent);

      this.loadLocations();
    }
  }

  getCategoryFilter() {
    return {
      categories:
        !this.storeType || this.storeType === 'alle' ? [] : [this.storeType],
    };
  }

  sanitizeRadius(rad: number): number {
    if (!rad || rad < 5) {
      return 5;
    }
    if (rad > 100) {
      return 100;
    }
    return rad;
  }
}
