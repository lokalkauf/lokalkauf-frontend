import { Component, OnInit } from '@angular/core';
import { GeoService } from 'src/app/services/map/geo.service';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { Location } from '../../models/location';
import { MapMarkerData } from 'src/app/models/mapMarkerData';
import { MapSettings } from 'src/app/models/mapSettings';
import { LatLngBounds } from 'leaflet';

@Component({
  selector: 'app-trader-map',
  templateUrl: './trader-map.component.html',
  styleUrls: ['./trader-map.component.scss'],
})
export class TraderMapComponent implements OnInit {
  locations: Array<MapMarkerData> = new Array<MapMarkerData>();
  currentMapBounds: LatLngBounds;

  constructor(private geoService: GeoService) {}

  ngOnInit(): void {
    this.loadTraders(10, [51.508623, 7.463673]);
  }

  changeTraders(settings: MapSettings) {
    let radius = settings.radiusToEdge / 1000;
    if (radius > 30) {
      radius = 30;
    }
    this.currentMapBounds = settings.boundingBox;
    // TODO: Enable this again, if change of map should load new traders
    // this.loadTraders(radius, [settings.center.lat, settings.center.lng]);
  }

  loadTraders(radius: number, position: number[]) {
    this.geoService
      .getLocations(radius, position)
      .then((value: GeoQuerySnapshot) => {
        this.locations = new Array<MapMarkerData>();
        value.forEach((loc: GeoFirestoreTypes.QueryDocumentSnapshot) => {
          this.locations.push({
            additionalData: loc.id,
            html: '',
            locationLatitude: loc.data().coordinates.latitude,
            locationLongitude: loc.data().coordinates.longitude,
          });
        });
      });
  }

  markerClicked(marker: MapMarkerData) {
    console.log(marker);
  }

  locationInBounds(location: MapMarkerData) {
    const west = this.currentMapBounds.getWest();
    const east = this.currentMapBounds.getEast();
    const north = this.currentMapBounds.getNorth();
    const south = this.currentMapBounds.getSouth();

    const lat = location.locationLatitude;
    const long = location.locationLongitude;

    return (
      ((long > west && long < east) || (long < west && long > east)) &&
      ((lat > north && lat < south) || (lat < north && lat > south))
    );
  }
}
