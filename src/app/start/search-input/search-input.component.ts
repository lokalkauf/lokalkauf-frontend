import { Component, OnInit, forwardRef, ViewChild, Input } from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { Observable, Subject, of, concat, from } from 'rxjs';
import {
  map,
  tap,
  filter,
  distinctUntilChanged,
  startWith,
  flatMap,
  switchMap,
} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { GeoService } from 'src/app/services/geo.service';
import { GeoAddress } from 'src/app/models/geoAddress';
import { TextService } from 'src/app/services/text.service';
import { uiTexts } from 'src/app/services/uiTexts';

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
  myControl = new FormControl();

  standorte: Array<GeoAddress> = [
    {
      postalcode: '50321',
      city: 'Brühl',
      coordinates: [50.823525, 6.897674],
      radius: 10,
    },
    {
      postalcode: '65183',
      city: 'Wiesbaden',
      coordinates: [50.0833521, 8.24145],
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

  filteredValues$: Observable<GeoAddress[]>;
  blur$ = new Subject();
  valueChanges$: Observable<GeoAddress>;
  userGeoAddress$: Observable<GeoAddress>;
  placeholder$: Observable<string>;

  isLoading = false;

  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  auto: MatAutocompleteTrigger;

  constructor(
    private geo: GeoService,
    private readonly textService: TextService
  ) {
    this.filteredValues$ = this.myControl.valueChanges.pipe(
      startWith(''),
      tap(() => (this.isLoading = true)),
      switchMap((value) => {
        if (typeof value !== 'string') {
          return of(null);
        }
        if (!value || value.length < 2) {
          return of(this.standorte);
        } else {
          this.isLoading = true;
          return this.findAddresses(value);
        }
      }),
      tap(() => (this.isLoading = false))
    );

    this.userGeoAddress$ = this.geo
      .getUserPosition()
      .pipe(
        flatMap((userPosition) =>
          this.geo.getPostalAndCityByLocation(userPosition)
        )
      );

    this.valueChanges$ = this.userGeoAddress$.pipe(
      flatMap((a) => {
        return concat(
          of(a),
          this.myControl.valueChanges.pipe(
            map((value) => {
              if (!value) {
                return a;
              }
              if (typeof value === 'string') {
                return null;
              }
              return value;
            }),
            distinctUntilChanged()
          )
        );
      })
    );

    this.placeholder$ = this.userGeoAddress$.pipe(
      filter((userGeoAddress) => userGeoAddress != null),
      map(
        (userGeoAddress) =>
          userGeoAddress.postalcode +
          ' ' +
          userGeoAddress.city +
          this.textService.getText(uiTexts.umkreissuche_userlocation_gpsenabled)
      ),
      startWith(
        this.textService.getText(uiTexts.umkreissuche_userlocation_text)
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

  findAddresses(plzORcity: string): Observable<GeoAddress[]> {
    return this.geo.findCoordinatesByAddress(plzORcity).pipe(
      map((addresses) => {
        if (!(addresses && addresses.records && addresses.records.length > 0)) {
          return [];
        }

        return addresses.records.map((record) => ({
          postalcode: record.fields.plz,
          city: record.fields.note,
          coordinates: record.fields.geo_point_2d,
          radius: 25,
        }));
      })
    );
  }
}
