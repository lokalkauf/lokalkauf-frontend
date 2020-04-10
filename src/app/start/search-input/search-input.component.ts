import { Component, OnInit, forwardRef, ViewChild, Input } from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {
  map,
  tap,
  filter,
  distinctUntilChanged,
  startWith,
  flatMap,
} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { GeoService } from 'src/app/services/geo.service';

export interface Value {
  display: string;
  location: {
    lat: string;
    lng: string;
    rad: number;
  };
}

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
  @Input() placeholder = 'gib eine PLZ ein (oder aktiviere GPS)';

  standorte: Value[] = [
    {
      display: '50321 Brühl',
      location: { lat: '50.823525', lng: '6.897674', rad: 10 },
    },
    {
      display: '65183 Wiesbaden',
      location: { lat: '50.0833521', lng: '8.24145', rad: 10 },
    },
    {
      display: 'Regionalverband Saarbrücken',
      location: { lat: '49.2789', lng: '6.9437', rad: 25 },
    },
    {
      display: 'Saarpfalz-Kreis',
      location: { lat: '49.1805', lng: '7.2194', rad: 25 },
    },
    {
      display: 'Neunkirchen',
      location: { lat: '49.3518', lng: '7.1864', rad: 25 },
    },
    {
      display: 'St. Wendel',
      location: { lat: '49.46667', lng: '7.166669', rad: 25 },
    },
    {
      display: 'Saarlouis',
      location: { lat: '49.3135', lng: '6.7523', rad: 25 },
    },
    {
      display: 'Merzig-Wadern',
      location: { lat: '49.4572', lng: '6.6867', rad: 35 },
    },
  ];

  filteredValues$: Observable<Value[]>;

  blur$ = new Subject();

  valueChanges$: Observable<Value>;

  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  auto: MatAutocompleteTrigger;

  constructor(private geo: GeoService) {
    this.filteredValues$ = this.myControl.valueChanges.pipe(
      startWith(''),
      flatMap(async (value) => {
        if (!value) {
          return this.standorte.filter((standort) =>
            standort.display
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
          );
        } else {
          return await this.findAddresses(value);
        }
      })
    );

    this.valueChanges$ = this.myControl.valueChanges.pipe(
      map((value) => (typeof value !== 'string' ? value : null)),
      distinctUntilChanged()
    );
  }

  async ngOnInit() {
    await this.initUserLocation();
  }

  onBlur() {
    this.blur$.next();
  }

  onFocus() {
    console.log('focus');
    this.auto.openPanel();
  }

  displayWith(standort: any) {
    return standort && standort.display;
  }

  writeValue(obj: Value | string): void {
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

  async initUserLocation() {
    const currentPosition = await this.geo.getUserPosition().toPromise();

    if (currentPosition && currentPosition.length > 1) {
      const address = await this.geo.getPostalAndCityByLocation(
        currentPosition
      );

      this.placeholder =
        address.postalcode + ' ' + address.city + ' (mein Standort)';
    }
  }

  async findAddresses(plzORcity: string) {
    console.log('search for: ' + plzORcity);
    const addresses: any = await this.geo.findCoordinatesByAddress(plzORcity).toPromise();


    const result = [];

    if (addresses && addresses.records && addresses.records.length > 0) {

      console.log(addresses.records);

      for (const a of addresses.records as Array<any>) {
        result.push({
          display: a.fields.note,
          location: { lat: a.fields.geo_point_2d[0], lng: a.fields.geo_point_2d[1], rad: 25 },
        });
      }
    }

    return result;
    // return postal;
    // .subscribe((d: any) => {
    //   this.suggestion = d.records.map((m) => m.fields);
    // });
  }
}
