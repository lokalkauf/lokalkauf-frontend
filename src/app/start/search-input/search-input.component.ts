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
  @Input() placeholder = this.textService.getText(
    uiTexts.umkreissuche_userlocation_text
  );

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

  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  auto: MatAutocompleteTrigger;

  constructor(
    private geo: GeoService,
    private readonly textService: TextService
  ) {
    this.filteredValues$ = this.myControl.valueChanges.pipe(
      startWith(''),
      flatMap(async (value) => {
        if (!value) {
          return this.standorte;
        } else {
          return await this.findAddresses(value);
        }
      })
    );

    this.valueChanges$ = from(this.initUserLocation()).pipe(
      flatMap((a) => {
        return concat(
          of(a),
          this.myControl.valueChanges.pipe(
            map((value) => {
              console.log(value);
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
  }

  async ngOnInit() {}

  onBlur() {
    this.blur$.next();
  }

  onFocus() {
    console.log('focus');
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

  async initUserLocation(): Promise<GeoAddress> {
    let address: GeoAddress;
    const currentPosition = await this.geo.getUserPosition().toPromise();

    if (currentPosition && currentPosition.length > 1) {
      address = await this.geo.getPostalAndCityByLocation(currentPosition);

      this.placeholder =
        address.postalcode +
        ' ' +
        address.city +
        this.textService.getText(uiTexts.umkreissuche_userlocation_gpsenabled);
    }

    console.log('address: ');
    console.log(address);

    return address;
  }

  async findAddresses(plzORcity: string) {
    console.log('search for: ' + plzORcity);
    const addresses: any = await this.geo
      .findCoordinatesByAddress(plzORcity)
      .toPromise();

    const result = [];

    if (addresses && addresses.records && addresses.records.length > 0) {
      console.log(addresses.records);

      for (const a of addresses.records as Array<any>) {
        result.push({
          postalcode: a.fields.plz,
          city: a.fields.note,
          coordinates: a.fields.geo_point_2d,
          radius: 25,
        });
      }
    }

    return result;
  }
}
