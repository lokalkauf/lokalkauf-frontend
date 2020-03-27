import { Component, OnInit } from '@angular/core';
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
} from 'leaflet';

import { GeoService } from 'src/app/services/geo.service';
import { mixinColor } from '@angular/material/core';
import { NONE_TYPE } from '@angular/compiler';
import { GeoQuerySnapshot, GeoFirestoreTypes } from 'geofirestore';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: Map;

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

  constructor(private geo: GeoService) {}

  onMapReady(map: Map) {
    this.map = map;
    this.targets.addTo(this.map);

    map.on('zoomend', () => {
      this.updateAfterZoom();
    });
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        this.updateCurrentPosition(
          latLng(p.coords.latitude, p.coords.longitude)
        );
        this.loadTrades(0.5);
      });
    }
  }

  updateAfterZoom() {
    var center = this.map.getCenter();
    var eastBound = this.map.getBounds().getEast();
    var centerEast = latLng(center.lat, eastBound);

    var dist = center.distanceTo(centerEast);
    var radius = dist * 2; //0.75
    var radiusInKm = radius / 1000;

    console.log('current radius' + radiusInKm + 'km');

    this.loadTrades(radiusInKm);
  }

  loadTrades(radius: number) {
    console.log('start loading docs...');

    this.geo
      .getLocations(radius, this.getCurrentPositionAsArray())
      .then((value: GeoQuerySnapshot) => {
        this.removeTargets(value);

        value.forEach((loc: GeoFirestoreTypes.QueryDocumentSnapshot) => {
          console.log(loc.data());
          this.updateTarget(
            latLng(
              loc.data().coordinates.latitude,
              loc.data().coordinates.longitude
            )
          );
        });
      });
  }

  removeTargets(loaded: GeoQuerySnapshot) {
    this.targets.getLayers().forEach((l: Marker) => {
      var exists = false;

      loaded.forEach((lt) => {
        if (
          lt.data().coordinates.latitude == l.getLatLng().lat &&
          lt.data().coordinates.longitude == l.getLatLng().lng
        ) {
          exists = true;
        }
      });

      if (!exists) this.targets.removeLayer(l);
    });
  }

  updateTarget(pos: LatLng) {
    var exists = false;
    this.targets.getLayers().forEach((l: Marker) => {
      if (l.getLatLng().lat == pos.lat && l.getLatLng().lng == pos.lng) {
        exists = true;
      }
    });

    if (!exists) marker(pos).addTo(this.targets);
  }

  updateCurrentPosition(pos: LatLng) {
    var lln = latLng(pos[0], pos[1]);

    console.log('war hier: ' + pos);

    (this.markers[0] as CircleMarker).setLatLng(pos);
    this.map.setView(pos, this.options.zoom);
  }

  getCurrentPosition() {
    return (this.markers[0] as CircleMarker).getLatLng();
  }

  getCurrentPositionAsArray() {
    return [this.getCurrentPosition().lat, this.getCurrentPosition().lng];
  }
}
