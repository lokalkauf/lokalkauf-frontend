import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  InjectionToken,
} from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { isNumber } from 'util';
import { debounce } from 'lodash';

import { GeoService } from 'src/app/services//geo.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScrollStrategy } from '@angular/cdk/overlay';

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

  constructor(private router: Router, private geo: GeoService) {
    this.search = debounce(this.search, 2000);
    this.disabledLosButton = true;
  }

  showError: boolean;

  ngOnInit(): void {
    this.getUserLocation();
  }

  consoleLog(event: any) {
    console.log(event);
  }

  private getUserLocation() {
    this.geo.getUserPosition().subscribe((p) => {
      if (p != null) {
        this.currentPosition = p;
        this.disabledLosButton = false;
      } 
      else 
      {
        this.disabledLosButton = true;
      }
    });
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

  haendlerRegistrieren() {
    this.router.navigateByUrl('/trader/register');
  }

  setposition(position: Array<number>) {
    this.suggestion = null;
    console.log('pos: ' + position);
    this.currentPosition = position;
    //this.geo.setUserPosition(this.currentPosition);
    this.disabledLosButton = false;
  }

  search(searchtext) {
    this.geo.search(searchtext).then((d: any) => {
      console.log(d);
      this.suggestion = d.records.map((m) => m.fields);

      console.log('result: ' + this.suggestion);
    });
  }
}
