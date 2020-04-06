import { Injectable } from '@angular/core';

export interface Location {
  lat: string;
  lng: string;
  rad?: number;
}

@Injectable()
export class StorageService {
  saveLocation(location: Location) {
    localStorage.setItem('city', JSON.stringify(location));
  }

  loadLocation(): Location {
    const city = localStorage.getItem('city');
    if (city) {
      return JSON.parse(city) as Location;
    }
    return undefined;
  }
}
