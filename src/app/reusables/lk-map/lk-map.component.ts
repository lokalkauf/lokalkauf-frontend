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
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'lk-map',
  templateUrl: './lk-map.component.html',
  styleUrls: ['./lk-map.component.scss'],
})
export class LkMapComponent implements OnInit, AfterViewInit {
  map: Map;
  radius: 0.5;

  @Output() positionChanged = new EventEmitter<any>();
  @Output() mapMove = new EventEmitter<any>();
  @Output() mapInit = new EventEmitter<any>();
  locations: Array<Location> = new Array<Location>();

  // esriTiles = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{x}/{y}.pbf';
  defaultTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  options = {
    layers: [
      tileLayer(this.defaultTiles, {
        maxZoom: 18,
        attribution: 'Open Street Map',
      }),
    ],
    zoom: 15,
    center: latLng(52.518623, 13.376198),
  };

  heartIconBig = icon({
    iconUrl: '/assets/lokalkauf-pin-blue-transparent.svg',
    iconSize: [30, 30],
    iconAnchor: [16, 25],

    shadowUrl: '/assets/pin-shadow.png',
    shadowSize: [30, 22],
    shadowAnchor: [8, 18],
  });

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

    this.map.on('move', (e: any) => {
      this.mapMove.emit(self.map.getCenter());
    });

    this.mapInit.emit();
  }

  ngOnInit(): void {}

  public setCenter(position: number[], zoom: number = 18) {
    if (position) {
      console.log('set center...' + position);

      this.map.flyTo(latLng(position[0], position[1]), 18);
    }
  }

  public addMarker(position?: number[]) {
    const pos = position ? this.creeateLatLng(position) : this.map.getCenter();

    const id = uuid();
    marker(pos, { alt: id, icon: this.heartIconBig }).addTo(this.map);

    // console.log('return id: ' + id);

    return id;
  }

  public updateMarkerPosition(markerId: string, position: number[]) {
    const mrkr: Marker = this.findMarkerById(markerId);

    // console.log('updatePos: ' + markerId);
    // console.log(mrkr);

    if (mrkr) {
      mrkr.setLatLng(this.creeateLatLng(position));
    }
  }

  private creeateLatLng(position: number[]) {
    return latLng(position[0], position[1]);
  }

  private findMarkerById(id: string) {
    let mrkr = null;
    this.map.eachLayer((layer) => {
      if (layer instanceof Marker) {
        if (layer.options.alt === id) {
          mrkr = layer;
        }
      }
    });
    return mrkr;
  }
}
