import { Injectable } from '@angular/core';
import { GeoAddress } from '../models/geoAddress';

@Injectable()
export class StorageService {
  saveLocation(location: GeoAddress) {
    localStorage.setItem('city', JSON.stringify(location));
  }

  loadLocation(): GeoAddress {
    const city = localStorage.getItem('city');
    if (city) {
      return JSON.parse(city) as GeoAddress;
    }
    return undefined;
  }
}
