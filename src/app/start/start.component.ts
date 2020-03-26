import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { isNumber } from 'util';

import { GeoService } from 'src/app/services//geo.service';

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

  @Input() coovalue: string;

  constructor(private router: Router, private geo: GeoService) {}

  showError: boolean;

  ngOnInit(): void {
    this.getUserLocation();
  }

  consoleLog(event: any) {
    console.log(event);
  }

  private getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.coovalue = 'hallo: ' + this.lat + '-' + this.lng;

        //this.geo.setLocation("meine-position", [this.lat, this.lng]);

        var l = this.geo.getLocations(0.5, [this.lat, this.lng]);

        this.coovalue = JSON.stringify(l);
      });
    }
  }

  action(plz: string) {
    if (this.isValidPlz(plz)) {
      this.showError = false;
      this.router.navigate(['/localtraders/' + plz]);
    }
    this.showError = true;
  }

  isValidPlz(plz: string): boolean {
    return !isNaN(Number(plz)) && Number(plz).toString().length === 5;
  }
}
