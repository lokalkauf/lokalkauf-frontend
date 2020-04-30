import { Injectable } from '@angular/core';
import { functions } from 'firebase';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  async nearBy(
    radius: number,
    coordinates: number[],

    filter?: { categories: string[] },
    paging = { desc: false, pageIndex: 0, pageSize: 150 }
  ): Promise<Location[]> {
    return await functions()
      .httpsCallable(`locationByDistance`)
      .call('Get Locatons', {
        radius,
        coordinates,
        desc: paging.desc,
        pageIndex: paging.pageIndex,
        pageSize: paging.pageSize,
        categories: filter?.categories,
      });
  }
}
