import { LatLngBounds, LatLng } from 'leaflet';

export interface MapSettings {
  boundingBox: LatLngBounds;
  center: LatLng;
  radiusToEdge: number;
}
