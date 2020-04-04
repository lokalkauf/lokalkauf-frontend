import {
  Component,
  OnInit,
  InjectionToken,
  ElementRef,
  ViewChild,
  ɵsetCurrentInjector,
} from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { isNumber } from 'util';
import { debounce } from 'lodash';

import { GeoService } from 'src/app/services//geo.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { $ } from 'protractor';
import { UserService } from '../services/user.service';
import { LkSelectOptions } from '../reusables/lk-select/lk-select.component';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {
  links = [
    new Link('Bäcker', '/', true),
    new Link('Fashion ', '#fashion', false),
    new Link('Metzger', '#fleisch', false),
    new Link('Kiosk', '#bier', false),
    new Link('Weiteres', '/test', true),
  ];

  MAT_AUTOCOMPLETE_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;

  lat: number;
  lng: number;

  coovalue: string;
  plz: string;
  coords: string;
  suggestion: any;

  standorte: Observable<LkSelectOptions[]>;
  standortPreselect: Observable<string>;

  currentPosition: Array<number>;
  disabledLosButton: boolean;

  isLoggedIn = false;

  preSelectedValue: any;

  @ViewChild('plzInput') plzInput: ElementRef;
  constructor(
    public router: Router,
    private geo: GeoService,
    public userService: UserService,
    private storageService: StorageService
  ) {
    this.search = debounce(this.search, 2000);
    this.disabledLosButton = true;
    this.userService.isLoggedIn$.subscribe((loggedin) => {
      this.isLoggedIn = loggedin;
    });
    this.standortPreselect = of('Bitte wähle eine Stadt aus');
    this.standorte = of([
      {
        key: '1',
        display: 'Brühl',
        value: { lat: '50.823525', lng: '6.897674' },
      },
      {
        key: '2',
        display: 'Wiesbaden',
        value: { lat: '50.0833521', lng: '8.24145' },
      },
    ]);
  }

  showError: boolean;

  ngOnInit(): void {
    //    this.getUserLocation();

    const city = this.storageService.loadLocation();
    if (city) {
      this.preSelectedValue = city;
    }
  }

  registerTrader() {
    this.router.navigateByUrl('/trader/register/new');
  }

  private getUserLocation() {
    this.geo.getUserPosition().subscribe((ps) => {
      if (ps != null) {
        this.currentPosition = ps;
        this.disabledLosButton = false;

        this.geo
          .getPostalAndCityByLocation(this.currentPosition)
          .subscribe((p: any) => {
            this.plz =
              p.results[0].components.postcode +
              ' ' +
              p.results[0].components.city;

            // this.plzInput.nativeElement.value = this.plz;
            // this.elRef.nativeElement.querySelector('#plz-input').value = this.plz;
          });
      } else {
        this.disabledLosButton = true;
      }
    });
  }

  focus() {
    const elem = this.plzInput.nativeElement;
    elem.scrollIntoView();
  }

  action() {
    if (this.currentPosition && this.currentPosition.length === 2) {
      this.router.navigate([
        '/localtraders',
        this.currentPosition[0],
        this.currentPosition[1],
      ]);
    }
  }

  reducedAction(val: any) {
    if (val.internalValue) {
      this.router.navigate([
        '/localtraders',
        val.internalValue.lat,
        val.internalValue.lng,
      ]);
      this.storageService.saveLocation(val.internalValue);
    }
  }

  setposition(position: Array<number>) {
    this.suggestion = null;
    this.currentPosition = position;
    this.disabledLosButton = false;
  }

  search(searchtext) {
    this.geo.findCoordinatesByAddress(searchtext).subscribe((d: any) => {
      this.suggestion = d.records.map((m) => m.fields);
    });
  }
}
