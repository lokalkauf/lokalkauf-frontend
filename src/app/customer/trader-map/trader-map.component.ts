import { Component, OnInit } from '@angular/core';
import { GeoService } from 'src/app/services/map/geo.service';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { Location } from '../../models/location';
import { MapMarkerData, ActivatedStatus } from 'src/app/models/mapMarkerData';
import { MapSettings } from 'src/app/models/mapSettings';
import { LatLngBounds } from 'leaflet';
import { TraderService } from 'src/app/services/trader.service';
import {
  TraderProfileStatus,
  TraderProfile,
} from 'src/app/models/traderProfile';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-trader-map',
  templateUrl: './trader-map.component.html',
  styleUrls: ['./trader-map.component.scss'],
})
export class TraderMapComponent implements OnInit {
  locations: Array<MapMarkerData> = new Array<MapMarkerData>();
  currentMapBounds: LatLngBounds;
  traders$: Observable<Array<Omit<TraderProfile, number>>>;

  constructor(
    private geoService: GeoService,
    private traderService: TraderService
  ) {}

  ngOnInit(): void {
    this.loadTraderPositions(10, [51.508623, 7.463673]);
  }

  boundingboxChanged(settings: MapSettings) {
    let radius = settings.radiusToEdge / 1000;
    if (radius > 30) {
      radius = 30;
    }
    this.currentMapBounds = settings.boundingBox;
    // TODO: Enable this again, if change of map should load new traders
    this.loadTraderPositions(radius, [
      settings.center.lat,
      settings.center.lng,
    ]);
  }

  loadTraderPositions(radius: number, position: number[]) {
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
      })
      .then(this.loadUpdatedTraders.bind(this));
  }

  loadUpdatedTraders(loadUpdatedTraders: any) {
    const locationsInBounds = this.locations.filter((x) =>
      this.locationInBounds(x)
    );

    let nearestLocations = locationsInBounds.sort(
      this.orderLocations.bind(this)
    );

    for (let i = 0; i < nearestLocations.length; i++) {
      if (i < 10) {
        nearestLocations[i].activatedStatus = ActivatedStatus.DEFAULT;
      } else {
        nearestLocations[i].activatedStatus = ActivatedStatus.DEACTIVATED;
      }
    }

    // TODO: Firebase only supports loading of nearest 10 traders!
    if (nearestLocations.length > 10) {
      nearestLocations = nearestLocations.slice(0, 9);
    }

    const traderIds = nearestLocations.map((x) => x.additionalData);

    if (traderIds.length === 0) {
      this.traders$ = null;
    } else {
      this.traders$ = this.traderService.getTraderProfiles(
        traderIds,
        TraderProfileStatus.PUBLIC
      );
    }
  }

  orderLocations(a: MapMarkerData, b: MapMarkerData): number {
    const latCenter = this.currentMapBounds.getCenter().lat;
    const lngCenter = this.currentMapBounds.getCenter().lng;

    const lengthAToCenter = Math.sqrt(
      Math.pow(latCenter - a.locationLatitude, 2) +
        Math.pow(lngCenter - a.locationLongitude, 2)
    );
    const lengthBToCenter = Math.sqrt(
      Math.pow(latCenter - b.locationLatitude, 2) +
        Math.pow(lngCenter - b.locationLongitude, 2)
    );

    return lengthAToCenter - lengthBToCenter;
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
