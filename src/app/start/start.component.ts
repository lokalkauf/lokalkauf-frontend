import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { isNumber } from 'util';
import { debounce } from 'lodash';

import { GeoService } from 'src/app/services//geo.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

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

  lat: number;
  lng: number;

  coovalue: string;
  plz: string;
  coords: string;

  suggestion: any;

  currentPosition: Array<number>;

  constructor(private router: Router, private geo: GeoService) {
    this.search = debounce(this.search, 2000);
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
      if (p != null) this.currentPosition = p;
    });
  }

  action() {
    this.router.navigate(['/localtraders/a']);
  }

  setposition(position: Array<number>) {
    this.suggestion = null;
    console.log('pos: ' + position);
    this.currentPosition = position;
    this.geo.setUserPosition(this.currentPosition);
  }

  search(searchtext) {
    this.geo.search(searchtext).then((d: any) => {
      console.log(d);
      this.suggestion = d.records.map((m) => m.fields);

      console.log('result: ' + this.suggestion);
    });
  }
}
