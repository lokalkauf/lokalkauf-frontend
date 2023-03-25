import { Component, OnInit, forwardRef, ViewChild, Input } from '@angular/core';
import {
  UntypedFormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import {
  Observable,
  Subject,
  of,
  concat,
  from,
  merge,
  combineLatest,
} from 'rxjs';
import {
  map,
  tap,
  filter,
  distinctUntilChanged,
  flatMap,
  switchMap,
  debounceTime,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import { MatLegacyAutocompleteTrigger as MatAutocompleteTrigger } from '@angular/material/legacy-autocomplete';
import { GeoService } from 'src/app/services/geo.service';
import { GeoAddress } from 'src/app/models/geoAddress';
import { TextService } from 'src/app/services/text.service';
import { uiTexts } from 'src/app/services/uiTexts';
import { StorageService } from 'src/app/services/storage.service';

type PlaceHolderAddress = GeoAddress & { display: string };

@Component({
  selector: 'lk-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
})
export class SearchInputComponent implements OnInit, ControlValueAccessor {
  myControl = new UntypedFormControl();

  standorte: Array<GeoAddress> = [
    {
      postalcode: '',
      city: 'Hannover',
      coordinates: [52.382936, 9.738806],
      radius: 25,
    },
    {
      postalcode: '',
      city: 'Wiesbaden',
      coordinates: [50.0833521, 8.24145],
      radius: 10,
    },
    {
      postalcode: '',
      city: 'Brühl',
      coordinates: [50.823525, 6.897674],
      radius: 10,
    },
    {
      postalcode: '',
      city: 'Regionalverband Saarbrücken',
      coordinates: [49.2789, 6.9437],
      radius: 25,
    },
    {
      postalcode: '',
      city: 'Saarpfalz-Kreis',
      coordinates: [49.1805, 7.2194],
      radius: 25,
    },
    {
      postalcode: '',
      city: 'Neunkirchen',
      coordinates: [49.3518, 7.1864],
      radius: 25,
    },
    {
      postalcode: '',
      city: 'St. Wendel',
      coordinates: [49.46667, 7.166669],
      radius: 25,
    },
    {
      postalcode: '',
      city: 'Saarlouis',
      coordinates: [49.3135, 6.7523],
      radius: 25,
    },
    {
      postalcode: '',
      city: 'Merzig-Wadern',
      coordinates: [49.4572, 6.6867],
      radius: 35,
    },
  ];

  autocompleteValues$: Observable<GeoAddress[]>;
  blur$ = new Subject();
  valueChanges$: Observable<GeoAddress>;
  userGeoAddress$: Observable<GeoAddress>;
  placeholder$: Observable<string>;

  isLoading = false;

  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  auto: MatAutocompleteTrigger;

  constructor(
    private geo: GeoService,
    storageService: StorageService,
    private readonly textService: TextService
  ) {
    this.autocompleteValues$ = concat(
      of(this.standorte),
      this.myControl.valueChanges.pipe(
        debounceTime(500),
        tap(() => (this.isLoading = true)),
        switchMap((x) => this.computeCurrentAutocompleteValues(x)),
        tap(() => (this.isLoading = false))
      )
    );

    this.userGeoAddress$ = concat(
      of(null),
      from(this.geo.getUserPosition()).pipe(
        flatMap((userPosition) =>
          userPosition
            ? this.geo.getPostalAndCityByLocation(userPosition)
            : of(null)
        )
      )
    );

    const placeHolderAddress$ = combineLatest([
      this.userGeoAddress$,
      concat(
        of(null),
        of(storageService.loadLocation())
      ) as Observable<GeoAddress>,
    ]).pipe(map((x) => this.computePlaceHolderAddress(x)));

    this.valueChanges$ = combineLatest([
      concat(of(null), this.myControl.valueChanges),
      placeHolderAddress$,
    ]).pipe(
      map((x) => this.computeCurrentGeoAdressValue(x)),
      distinctUntilChanged()
    );

    this.placeholder$ = concat(
      of(this.textService.getText(uiTexts.umkreissuche_userlocation_text)),
      placeHolderAddress$.pipe(
        filter((placeHolderAddress) => placeHolderAddress != null),
        map((placeHolderAddress) => placeHolderAddress.display)
      )
    );
  }

  async ngOnInit() {}

  onBlur() {
    this.blur$.next();
  }

  onFocus() {
    this.auto.openPanel();
  }

  displayWith(address: GeoAddress) {
    return address ? address.postalcode + ' ' + address.city : '';
  }

  writeValue(obj: GeoAddress): void {
    this.myControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.valueChanges$.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.blur$.subscribe(fn);
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.myControl.disable() : this.myControl.enable();
  }

  private findAddresses(plzORcity: string): Observable<GeoAddress[]> {
    return this.geo.findCoordinatesByPostalOrCity(plzORcity).pipe(
      map((a: GeoAddress[]) => {
        return a.map((adr) => {
          adr.radius = adr.postalcode ? 5 : 25;
          return adr;
        });
      })
    );
  }

  private computeCurrentAutocompleteValues(
    inputValue: any
  ): Observable<GeoAddress[]> {
    if (typeof inputValue !== 'string') {
      return of(null);
    }
    if (!inputValue || inputValue.length < 3) {
      return of(this.standorte);
    } else {
      this.isLoading = true;
      return this.findAddresses(inputValue);
    }
  }

  private computePlaceHolderAddress([userGeoAddress, lastSearchAddress]: [
    GeoAddress,
    GeoAddress
  ]): PlaceHolderAddress | null {
    if (lastSearchAddress) {
      const postal = lastSearchAddress.postalcode;
      const city = lastSearchAddress.city;
      return {
        ...lastSearchAddress,
        display: `${postal} ${city}`,
      };
    }
    if (userGeoAddress) {
      const postal = userGeoAddress.postalcode;
      const city = userGeoAddress.city;
      const text = this.textService.getText(
        uiTexts.umkreissuche_userlocation_gpsenabled
      );
      return {
        ...userGeoAddress,
        display: `${postal} ${city} ${text}`,
      };
    }
    return null;
  }

  private computeCurrentGeoAdressValue([inputValue, placeHolderAddress]: [
    any,
    PlaceHolderAddress
  ]): GeoAddress | null {
    if (!inputValue) {
      return placeHolderAddress;
    }
    if (typeof inputValue === 'string') {
      return null;
    }
    return inputValue;
  }
}
