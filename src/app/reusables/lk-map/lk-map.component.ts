import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  Map,
  tileLayer,
  latLng,
  marker,
  Marker,
  layerGroup,
  icon,
  LayerGroup,
} from 'leaflet';

import { Location } from '../../models/location';
import { GeoService } from '../../services/geo.service';
import { v4 as uuid } from 'uuid';
import { MapMarkerData } from 'src/app/models/mapMarkerData';
import * as L from 'leaflet';
import { MapPosition } from 'src/app/models/mapPosition';

@Component({
  selector: 'lk-map',
  templateUrl: './lk-map.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './lk-map.component.scss',
    '../../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
  ],
})
export class LkMapComponent implements OnInit, AfterViewInit {
  map: Map;
  radius: 0.5;

  @Output() positionChanged = new EventEmitter<any>();
  @Output() mapMove = new EventEmitter<any>();
  @Output() mapInit = new EventEmitter<any>();
  @Output() markerClicked: EventEmitter<MapMarkerData> = new EventEmitter<
    MapMarkerData
  >();
  locations: Array<Location> = new Array<Location>();
  markerLayerFromMapMarkerData: Array<Marker>;

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
  updateMapWhenReady: MapPosition;

  @Input('markers')
  set editMarkers(markers: Array<MapMarkerData>) {
    this.markerLayerFromMapMarkerData = new Array();

    const markerIcon = icon({
      iconUrl: '/assets/pin.png',
      shadowUrl: '/assets/pin-shadow.png',

      iconSize: [25, 29],
      shadowSize: [25, 29],
      iconAnchor: [16, 25],
      shadowAnchor: [6, 26],
    });

    for (const oneMarker of markers) {
      const thisMarker = L.marker(
        latLng(oneMarker.locationLatitude, oneMarker.locationLongitude),
        { icon: markerIcon }
      ).addEventListener('click', () => {
        this.markerClicked.emit(oneMarker);
      });
      this.markerLayerFromMapMarkerData.push(thisMarker);
    }
  }

  @Input('position')
  set updatePosition(position: MapPosition) {
    this.flyTo(position);
  }

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

    if (this.updateMapWhenReady) {
      this.map.setView(
        latLng(
          this.updateMapWhenReady.latitude,
          this.updateMapWhenReady.longitude
        ),
        this.updateMapWhenReady.zoom
      );
    }
  }

  ngOnInit(): void {}

  public setCenter(position: number[], zoom: number = 18) {
    if (position) {
      console.log('set center...' + position);

      this.map.flyTo(latLng(position[0], position[1]), 18);
    }
  }

  public addMarker(position?: number[]) {
    const pos = position ? this.createLatLng(position) : this.map.getCenter();

    const id = uuid();
    marker(pos, { alt: id, icon: this.heartIconBig }).addTo(this.map);

    return id;
  }

  public updateMarkerPosition(markerId: string, position: number[]) {
    const mrkr: Marker = this.findMarkerById(markerId);

    if (mrkr) {
      mrkr.setLatLng(this.createLatLng(position));
    }
  }

  flyTo(mapPosition: MapPosition) {
    if (this.map) {
      this.map.flyTo(
        latLng(mapPosition.latitude, mapPosition.longitude),
        mapPosition.zoom
      );
    } else {
      this.updateMapWhenReady = mapPosition;
    }
  }

  private createLatLng(position: number[]) {
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
