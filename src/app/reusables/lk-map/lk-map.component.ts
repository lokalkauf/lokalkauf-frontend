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
} from 'leaflet';

import { Location } from '../../models/location';
import { GeoService } from '../../services/geo.service';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { from } from 'rxjs';

@Component({
  selector: 'lk-map',
  templateUrl: './lk-map.component.html',
  styleUrls: ['./lk-map.component.scss'],
})
export class LkMapComponent implements OnInit, AfterViewInit {
  map: Map;
  radius: 0.5;

  @Output() positionChanged = new EventEmitter<any>();
  locations: Array<Location> = new Array<Location>();

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

  markers = [
    // circleMarker(latLng(52.518623, 13.376198), {
    //   color: '#000',
    //   fillColor: '#0f0',
    //   fillOpacity: 1,
    //   opacity: 0.2,
    //   weight: 25,
    //   radius: 7,
    // }),
  ];

  constructor(private geo: GeoService) {}

  ngAfterViewInit(): void {}

  onMapReady(map: Map) {
    this.map = map;

    const self = this;

    this.map.on('moveend', (e: any) => {
      this.positionChanged.emit(self.map.getCenter());
    });
  }

  ngOnInit(): void {}

  public setCenter(position: number[], zoom: number = 18) {
    if (position) {
      console.log('set center...' + position);

      this.map.flyTo(latLng(position[0], position[1]), 18);
    }
  }
}
