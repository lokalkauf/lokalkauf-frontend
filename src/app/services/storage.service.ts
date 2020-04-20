import { Injectable } from '@angular/core';
import { GeoAddress } from '../models/geoAddress';
import { LkSelectOptions } from '../reusables/lk-select/lk-select.component';

@Injectable()
export class StorageService {
  saveUserPosition(location: number[], toLocalStorage?: boolean) {
    this.save('user-position', location, toLocalStorage);
  }

  loadUserPosition(fromLocalStorage?: boolean): number[] {
    return this.load('user-position', fromLocalStorage);
  }

  saveLocation(location: GeoAddress, toLocalStorage?: boolean) {
    this.save('city', location, toLocalStorage);
  }

  loadLocation(fromLocalStorage?: boolean): GeoAddress {
    return this.load('city', fromLocalStorage);
  }

  saveTraderFilter(filter: LkSelectOptions) {
    this.save('trader-filter', filter);
  }

  loadTraderFilter(): LkSelectOptions {
    return this.load('trader-filter');
  }

  private save<T>(key: string, item: T, toLocalStorage?: boolean) {
    const jsonItem = JSON.stringify(item);

    if (toLocalStorage === true) {
      localStorage.setItem(key, jsonItem);
    } else {
      sessionStorage.setItem(key, jsonItem);
    }
  }

  private loadSimple(key: string, fromLocalStorage?: boolean) {
    const storeItem =
      fromLocalStorage === true
        ? localStorage.getItem(key)
        : sessionStorage.getItem(key);

    return storeItem ? storeItem : undefined;
  }

  private load<T>(key: string, fromLocalStorage?: boolean): T {
    const storeItem =
      fromLocalStorage === true
        ? localStorage.getItem(key)
        : sessionStorage.getItem(key);

    if (storeItem) {
      return JSON.parse(storeItem) as T;
    }

    return undefined;
  }
}
