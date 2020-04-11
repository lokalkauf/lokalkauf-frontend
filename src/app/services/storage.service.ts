import { Injectable } from '@angular/core';
import { GeoAddress } from '../models/geoAddress';

@Injectable()
export class StorageService {
  saveLocation(location: GeoAddress, toLocalStorage?: boolean) {
    this.save('city', location, toLocalStorage);
  }

  loadLocation(fromLocalStorage?: boolean): GeoAddress {
    return this.load('city', fromLocalStorage);
  }

  private save<T>(key: string, item: T, toLocalStorage?: boolean) {
    const jsonItem = JSON.stringify(item);

    if (toLocalStorage === true) {
      localStorage.setItem(key, jsonItem);
    } else {
      sessionStorage.setItem(key, jsonItem);
    }
  }

  private load<T>(key: string, fromLocalStorage?: boolean): T {
    const jsonItem =
      fromLocalStorage === true
        ? localStorage.getItem(key)
        : sessionStorage.getItem(key);

    if (jsonItem) {
      return JSON.parse(jsonItem) as T;
    }

    return undefined;
  }
}
