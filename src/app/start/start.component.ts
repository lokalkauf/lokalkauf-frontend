import {
  Component,
  OnInit,
  InjectionToken,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { isNumber } from 'util';
import { debounce } from 'lodash';

import { GeoService } from 'src/app/services//geo.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { $ } from 'protractor';
import { UserService } from '../services/user.service';

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

  currentPosition: Array<number>;
  disabledLosButton: boolean;

  isLoggedIn = false;

  @ViewChild('plzInput') plzInput: ElementRef;
  constructor(
    public router: Router,
    private geo: GeoService,
    public userService: UserService
  ) {
    this.search = debounce(this.search, 2000);
    this.disabledLosButton = true;
    this.userService.isLoggedIn$.subscribe((loggedin) => {
      this.isLoggedIn = loggedin;
    });
  }

  showError: boolean;

  ngOnInit(): void {
    //    this.getUserLocation();
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

  reducedAction() {
    this.router.navigate(['/localtraders', 0, 0]);
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
