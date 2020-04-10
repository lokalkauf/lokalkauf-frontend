import {
  Component,
  OnInit,
  InjectionToken,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { debounce } from 'lodash';

import { GeoService } from '../services/geo.service';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { FormControl, Validators } from '@angular/forms';

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
  DEFAULT = 'DEFAULT';

  lat: number;
  lng: number;

  coovalue: string;
  plz: string;
  coords: string;
  suggestion: any;

  currentPosition: Array<number>;
  disabledLosButton: boolean;

  isLoggedIn = false;

  preSelectedValue: any;

  locationFormControl = new FormControl(null, [Validators.required]);

  @ViewChild('searchInput', { read: ElementRef }) searchInput: any;
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
  }

  showError: boolean;

  ngOnInit(): void {
    const city = this.storageService.loadLocation();
    if (city) {
      this.preSelectedValue = city;
    }
  }

  registerTrader() {
    this.router.navigateByUrl('/trader/register/new');
  }

  // private getUserLocation() {
  //   this.geo.getUserPosition().subscribe((ps) => {
  //     if (ps != null) {
  //       this.currentPosition = ps;
  //       this.disabledLosButton = false;

  //       this.geo
  //         .getPostalAndCityByLocation(this.currentPosition)
  //         .subscribe((p: any) => {
  //           this.plz =
  //             p.results[0].components.postcode +
  //             ' ' +
  //             p.results[0].components.city;

  //           // this.plzInput.nativeElement.value = this.plz;
  //           // this.elRef.nativeElement.querySelector('#plz-input').value = this.plz;
  //         });
  //     } else {
  //       this.disabledLosButton = true;
  //     }
  //   });
  // }

  focus() {
    const elem = this.plzInput.nativeElement;
    elem.scrollIntoView();
  }

  // action() {
  //   if (this.currentPosition && this.currentPosition.length === 3) {
  //     this.router.navigate([
  //       '/localtraders',
  //       this.currentPosition[0],
  //       this.currentPosition[1],
  //       this.currentPosition[2],
  //     ]);
  //   }
  // }

  searchPlace() {
    const val = this.locationFormControl.value;
    if (!val) {
      this.searchInput.nativeElement.getElementsByTagName('input')[0].focus();
      return;
    }
    this.router.navigate([
      '/localtraders',
      val.location.lat,
      val.location.lng,
      val.location.rad,
    ]);
    this.storageService.saveLocation(val.location);
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
