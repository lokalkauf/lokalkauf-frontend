import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  Map,
  tileLayer,
  latLng,
  marker,
  circleMarker,
  icon,
  popup,
  LeafletEvent,
  LatLngBounds,
} from 'leaflet';

import { Location } from '@angular/common';
import { MapMarkerData } from 'src/app/models/mapMarkerData';
import { MapSettings } from 'src/app/models/mapSettings';
import { tap } from 'rxjs/operators';
import { Subscription, bindCallback } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GeoService } from 'src/app/services/geo.service';
import { MapPosition } from 'src/app/models/mapPosition';

@Component({
  selector: 'lk-map',
  templateUrl: './lk-map.component.html',
  styleUrls: ['./lk-map.component.scss'],
})
export class LkMapComponent implements OnInit {
  @Output() boundingboxChanged: EventEmitter<MapSettings> = new EventEmitter<
    MapSettings
  >();
  @Output() markerClicked: EventEmitter<MapMarkerData> = new EventEmitter<
    MapMarkerData
  >();

  tdefault = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  options = {
    layers: [
      tileLayer(this.tdefault, {
        maxZoom: 18,
        attribution: 'Open Street Map',
      }),
    ],
    zoom: 15,
    center: latLng(52.518623, 13.376198),
  };

  lkIcon = {
    iconUrl: '/assets/pin.png',
    iconSize: [60, 68],
  };

  markers = new Array<any>();

  currentUserPosition: any;

  map: Map;
  updateMapWhenReady: MapPosition;

  constructor(
    private geo: GeoService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.geo.getUserPosition().then((x) => this.updateUserPosition(x, 10));
  }

  @Input('traderLocations')
  set setTraderLocations(traderLocations: Array<MapMarkerData>) {
    this.markers = new Array<any>();

    if (traderLocations) {
      this.markers = traderLocations.map((x) =>
        marker(latLng(x.locationLatitude, x.locationLongitude))
          .setIcon(
            icon({
              iconUrl: '/assets/pin.png',
              shadowUrl: '/assets/pin-shadow.png',

              iconSize: [25, 29],
              shadowSize: [25, 29],
              iconAnchor: [16, 25],
              shadowAnchor: [6, 26],
            })
          )
          .addEventListener('click', () => {
            this.markerClicked.emit(x);
          })
      );
    }

    if (this.currentUserPosition) {
      this.markers.push(this.currentUserPosition);
    }
  }

  @Input('position')
  set updatePosition(position: MapPosition) {
    this.flyTo(position);
  }

  updatedBounding(eventData: LeafletEvent) {
    const map: Map = eventData.target;
    const center = map.getCenter();
    const boundingBox: LatLngBounds = map.getBounds();
    const radiusToEdge = map.distance(center, boundingBox.getNorthEast());
    this.boundingboxChanged.emit({ boundingBox, center, radiusToEdge });
  }

  updateUserPosition(currentPositionLatLng: Array<number>, zoom: number) {
    let foundIndex = -1;
    if (this.currentUserPosition) {
      foundIndex = this.markers.findIndex(this.currentUserPosition);
    }

    if (currentPositionLatLng) {
      this.currentUserPosition = circleMarker(
        latLng(currentPositionLatLng[0], currentPositionLatLng[1]),
        {
          color: '#000',
          fillColor: '#0f0',
          fillOpacity: 1,
          opacity: 0.2,
          weight: 25,
          radius: 7,
        }
      );
    }

    if (foundIndex === -1) {
      this.markers.push(this.currentUserPosition);
    }
  }

  mapReady(map: Map) {
    this.map = map;
    this.map.setView(
      latLng(
        this.updateMapWhenReady.latitude,
        this.updateMapWhenReady.longitude
      ),
      this.updateMapWhenReady.zoom
    );
  }

  flyTo(mapPosition: MapPosition) {
    this.updateMapWhenReady = mapPosition;
    if (this.map) {
      this.map.flyTo(
        latLng(mapPosition.latitude, mapPosition.longitude),
        mapPosition.zoom
      );
    }
  }
}
