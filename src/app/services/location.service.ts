import { Injectable } from '@angular/core';
import { functions } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  async nearBy(
    radius: number,
    coordinates: number[],

    paging = { desc: false, pageIndex: 0, pageSize: 150 },
    filter?: { categories: string[] }
  ) {
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
