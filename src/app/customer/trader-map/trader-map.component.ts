import { Component, OnInit } from '@angular/core';
import { GeoService } from 'src/app/services/map/geo.service';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { Location } from '../../models/location';

@Component({
  selector: 'app-trader-map',
  templateUrl: './trader-map.component.html',
  styleUrls: ['./trader-map.component.scss'],
})
export class TraderMapComponent implements OnInit {
  locations: Array<Location> = new Array<Location>();

  constructor(private geoService: GeoService) {}

  ngOnInit(): void {
    this.loadTraders(10);
  }

  loadTraders(radius: number) {
    this.geoService
      .getLocations(radius, [51.508623, 7.463673])
      .then((value: GeoQuerySnapshot) => {
        this.locations = new Array<Location>();
        value.forEach((loc: GeoFirestoreTypes.QueryDocumentSnapshot) => {
          this.locations.push({
            traderId: loc.id,
            coordinates: [
              loc.data().coordinates.latitude,
              loc.data().coordinates.longitude,
            ],
            distance: loc.distance,
          });
        });
      });
  }
}
