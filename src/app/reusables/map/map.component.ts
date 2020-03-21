import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng, marker } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' })
    ],
    zoom: 15,
    center: latLng(52.518623, 13.376198)
  };

  markers = [
    marker(latLng(52.518623, 13.376198))
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
