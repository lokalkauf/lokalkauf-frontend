import { Component, OnInit, forwardRef, ViewChild } from '@angular/core';
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
} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

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
  standorte: Value[] = [
    {
      display: 'Brühl',
      location: { lat: '50.823525', lng: '6.897674', rad: 10 },
    },
    {
      display: 'Wiesbaden',
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
      display: ' St. Wendel',
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

  constructor() {
    this.filteredValues$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (typeof value === 'string') {
          return this.standorte.filter((standort) =>
            standort.display
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase())
          );
        } else {
          return [value];
        }
      })
    );

    this.valueChanges$ = this.myControl.valueChanges.pipe(
      map((value) => (typeof value !== 'string' ? value : null)),
      distinctUntilChanged()
    );
  }

  ngOnInit(): void {}

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
}
