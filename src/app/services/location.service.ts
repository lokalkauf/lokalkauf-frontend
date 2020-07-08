import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import { Paging } from '../models/paging';
import algoliasearch from 'algoliasearch/lite';

import * as firebase from 'firebase/app';
import 'firebase/functions';
import { Trader } from '../models/trader';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() { }

  async nearBy(
    radius: number,
    coordinates: number[],
    searchString: string,
    filter?: { categories: string[] }
  ): Promise<Array<Trader>> {
    const client = algoliasearch(environment.algolia.appId, environment.algolia.searchKey);
    const index = client.initIndex(environment.algolia.indexName);

    const categories: string[] = [];
    filter.categories.map((category) => {
      categories.push(`storeType.${category}=1`);
    });
    return await index
      .search(searchString, {
        aroundLatLng: `${coordinates[0]}, ${coordinates[1]}`,
        aroundRadius: radius * 1000,
        getRankingInfo: true,
        filters: categories.join(' OR '),
        // 1000 is max
        hitsPerPage: 1000,
      })
      .then(({ hits }) => {
        console.log(hits);
        return hits.map(
          (trader: any) =>
            (({
              ...trader,
              id: trader.objectID,
              distance: trader._rankingInfo.geoDistance / 1000,
            } as any) as Trader)
        );
      });
  }

  // async countNearBy(radius: number, coordinates: number[]): Promise<Paging> {
  //   // Is it smart to call nearBy twice? This seams to take quite long.
  //   const result = await this.nearBy(
  //     radius,
  //     coordinates,
  //     { categories: [], countOnly: true },
  //     { desc: false, pageIndex: 0, pageSize: 100000 }
  //   );

  //   return result.data.paging;
  // }
}
