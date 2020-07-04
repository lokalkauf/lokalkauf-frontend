import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import { Paging } from '../models/paging';
import algoliasearch from 'algoliasearch/lite';

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
    const client = algoliasearch(
      'V051EVLWXE',
      '85739eacae698fba1aaf524e40fe1b99'
    );
    const index = client.initIndex('traders_st');
    return await index
      .search('', {
        aroundLatLng: `${coordinates[0]}, ${coordinates[1]}`,
        aroundRadius: radius * 1000,
      })
      .then(({ hits }) => {
        return hits;
      });
    const res = await firebase
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
    console.log(res);
  }

  async countNearBy(radius: number, coordinates: number[]): Promise<Paging> {
    // Is it smart to call nearBy twice? This seams to take quite long.
    const result = await this.nearBy(
      radius,
      coordinates,
      { categories: [], countOnly: true },
      { desc: false, pageIndex: 0, pageSize: 100000 }
    );

    return result.data.paging;
  }
}
