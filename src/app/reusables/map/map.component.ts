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
import { GeoService } from 'src/app/services/map/geo.service';
import { MapMarkerData } from 'src/app/models/mapMarkerData';
import { MapSettings } from 'src/app/models/mapSettings';
import { tap } from 'rxjs/operators';
import { Subscription, bindCallback } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
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

  popup = popup().setContent(
    '<p>add retail location:<br /><input id="rid" style="border:1px solid #000"/>' +
      '<br/><button id="btnCrlc" style="background-color:#aaa; margin-top:10px;">create</button></p>'
  );
  userposition: Subscription;
  currentUserPosition: any;

  constructor(
    private geo: GeoService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userposition = this.geo
      .getUserPosition()
      .pipe(tap((x) => this.updateUserPosition(x, 10)))
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.userposition) {
      this.userposition.unsubscribe();
      this.userposition = null;
    }
  }

  @Input('traderLocations')
  set setTraderLocations(traderLocations: Array<MapMarkerData>) {
    this.markers = new Array<any>();

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
        .addEventListener('click', () => this.markerClicked.emit(x))
    );

    if (this.currentUserPosition) {
      this.markers.push(this.currentUserPosition);
    }
  }

  updatedBounding(eventData: LeafletEvent) {
    const map: Map = eventData.target;
    const zoom = map.getZoom();
    const center = map.getCenter();
    this.location.go(
      '/tradermap/' + center.lat + '/' + center.lng + '/' + zoom
    );
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

  saveMap(map: Map) {
    this.activatedRoute.params.subscribe((x) =>
      this.initializeMapPositon(x, map)
    );
  }

  private initializeMapPositon(x: Params, map: Map): void {
    if (x.lat && x.lng && x.zoomlvl) {
      map.setView(latLng(x.lat, x.lng), x.zoomlvl);
    }
  }
}
