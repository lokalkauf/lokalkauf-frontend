import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  Map,
  tileLayer,
  latLng,
  marker,
  CircleMarker,
  circleMarker,
  LatLng,
  Marker,
  layerGroup,
  icon,
  popup,
  LeafletEvent,
  LatLngBounds,
} from 'leaflet';

import { Location } from 'src/app/models/location';
import { GeoService } from 'src/app/services/map/geo.service';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Output() boundingboxChanged: EventEmitter<LatLngBounds> = new EventEmitter<
    LatLngBounds
  >();

  map: Map;
  radius: 0.5;

  @Output() locationsOnMap = new EventEmitter<any>();
  locations: Array<Location> = new Array<Location>();

  mct = 'https://maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png';
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

  targets = layerGroup();

  markers = [];

  rid: string;

  popup = popup().setContent(
    '<p>add retail location:<br /><input id="rid" style="border:1px solid #000"/>' +
      '<br/><button id="btnCrlc" style="background-color:#aaa; margin-top:10px;">create</button></p>'
  );

  constructor(private geo: GeoService) {}

  @Input('traderLocations')
  set setTraderLocations(traderLocations: Array<Location>) {
    this.markers = traderLocations.map((x) =>
      marker(latLng(x.coordinates[0], x.coordinates[1])).setIcon(
        icon({
          iconUrl: '/assets/pin.png',
          shadowUrl: '/assets/pin-shadow.png',

          iconSize: [25, 29],
          shadowSize: [25, 29],
          iconAnchor: [16, 25],
          shadowAnchor: [6, 26],
        })
      )
    );
  }

  ngOnInit(): void {}

  // logic..

  updatedBounding(eventData: LeafletEvent) {
    this.boundingboxChanged.emit(eventData.target.getBounds());
  }
}
