import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import { Paging } from '../models/paging';

import * as firebase from 'firebase/app';
import 'firebase/functions';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  async nearBy(
    radius: number,
    coordinates: number[],

    filter?: { categories: string[]; countOnly?: boolean },
    paging = { desc: false, pageIndex: 0, pageSize: 150 }
  ): Promise<any> {
    return await firebase
      .functions()
      .httpsCallable(`locationByDistance`)
      .call('Get Locatons', {
        radius,
        coordinates,
        desc: paging.desc,
        pageIndex: paging.pageIndex,
        pageSize: paging.pageSize,
        categories: filter?.categories,
        countOnly: filter?.countOnly === true,
      });
  }

  async countNearBy(radius: number, coordinates: number[]): Promise<Paging> {
    const result = await this.nearBy(
      radius,
      coordinates,
      { categories: [], countOnly: true },
      { desc: false, pageIndex: 0, pageSize: 100000 }
    );

    return result.data.paging;
  }
}
