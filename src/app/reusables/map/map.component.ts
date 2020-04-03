import {
  Component,
  OnInit,
  AfterViewInit,
  Injector,
  Inject,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
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
  Control,
  layerGroup,
  LayerGroup,
  icon,
  LeafletEvent,
  popup,
  DomEvent,
} from 'leaflet';

import { Location } from 'src/app/models/location';
import { GeoService } from 'src/app/services/geo.service';
import { mixinColor } from '@angular/material/core';
import { NONE_TYPE } from '@angular/compiler';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';
import { IconOptions } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { TraderItemComponent } from 'src/app/customer/trader-item/trader-item.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
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

  markers = [
    circleMarker(latLng(52.518623, 13.376198), {
      color: '#000',
      fillColor: '#0f0',
      fillOpacity: 1,
      opacity: 0.2,
      weight: 25,
      radius: 7,
    }),
  ];

  rid: string;

  popup = popup().setContent(
    '<p>add retail location:<br /><input id="rid" style="border:1px solid #000"/>' +
      '<br/><button id="btnCrlc" style="background-color:#aaa; margin-top:10px;">create</button></p>'
  );

  constructor(private geo: GeoService) {}

  ngAfterViewInit(): void {
    this.geo.getUserPosition().subscribe((p) => {
      if (p != null) {
        this.updateUserCircleMarker(latLng(p[0], p[1]));
        this.loadTraders(0.5);
      }
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    this.targets.addTo(this.map);

    this.map.on('zoomend', () => {
      this.refreshMap();
    });

    const self = this;

    // debug stuff,

    let trCreated = false;

    this.map.on('click', (e: any) => {
      const ma = marker(e.latlng);
      ma.bindPopup(this.popup)
        .addTo(this.targets)
        .on('popupopen', (ev: any) => {
          trCreated = false;

          ev.popup._container
            .querySelector('#btnCrlc')
            .addEventListener('click', (ev2: any) => {
              const pos: LatLng = e.latlng;

              const tid = ev.popup._container.querySelector('#rid');
              self.createTraderLocationForDebug(tid.value, pos);
              trCreated = true;
              ma.closePopup();
            });
        })
        .on('popupclose', (evs: any) => {
          this.loadTraders(this.radius);
        });

      ma.openPopup();
    });
  }

  ngOnInit(): void {}

  // logic..

  refreshMap() {
    const center = this.map.getCenter();
    const eastBound = this.map.getBounds().getEast();
    const centerEast = latLng(center.lat, eastBound);

    const dist = center.distanceTo(centerEast);
    const radius = dist * 2; // 0.75
    const radiusInKm = radius / 1000;

    this.loadTraders(radiusInKm);
  }

  loadTraders(radius: number) {
    this.geo
      .getLocations(radius, this.getPositionOfUserCircleMarkerAsArray())
      .then((value: GeoQuerySnapshot) => {
        this.removeTraderMarker(value);
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

          this.createTraderMarkerIfNotExists(
            latLng(
              loc.data().coordinates.latitude,
              loc.data().coordinates.longitude
            ),
            loc.id
          );
        });
      })
      .finally(() => {
        this.locationsOnMap.emit(this.locations);
      });
  }

  removeTraderMarker(loaded: GeoQuerySnapshot) {
    this.targets.getLayers().forEach((l: Marker) => {
      let exists = false;

      loaded.forEach((lt) => {
        if (
          lt.data().coordinates.latitude === l.getLatLng().lat &&
          lt.data().coordinates.longitude === l.getLatLng().lng
        ) {
          exists = true;
        }
      });

      if (!exists) {
        this.targets.removeLayer(l);
      }
    });
  }

  createTraderMarkerIfNotExists(pos: LatLng, traderID: string) {
    let exists = false;
    this.targets.getLayers().forEach((l: Marker) => {
      if (l.getLatLng().lat === pos.lat && l.getLatLng().lng === pos.lng) {
        exists = true;
      }
    });

    const self = this;

    if (!exists) {
      marker(pos, { alt: traderID, attribution: '20' })
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
        .addTo(this.targets)
        .on('click', (e: any) => {
          const tradersLocation = {
            id: e.target.options.alt,
            coordinates: e.latlng,
            distance: Number.parseFloat(e.target.options.attribution),
          };

          self.scrollToView2(tradersLocation.id);
        });
    }
  }

  updateUserCircleMarker(pos: LatLng) {
    const lln = latLng(pos[0], pos[1]);

    (this.markers[0] as CircleMarker).setLatLng(pos);
    this.map.setView(pos, this.options.zoom);
  }

  getPositionOfUserCircleMarker() {
    return (this.markers[0] as CircleMarker).getLatLng();
  }

  getPositionOfUserCircleMarkerAsArray() {
    return [
      this.getPositionOfUserCircleMarker().lat,
      this.getPositionOfUserCircleMarker().lng,
    ];
  }

  scrollToView2(elem: string) {
    window.location.hash = '';
    window.location.hash = '#scroller.' + elem;
  }

  createTraderLocationForDebug(traderID: string, position: LatLng) {
    this.geo.createLocation(traderID, [position.lat, position.lng]);
  }
}
