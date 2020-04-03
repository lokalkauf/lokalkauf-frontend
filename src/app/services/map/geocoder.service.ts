import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeocoderService {
  constructor(private http: HttpClient) {}

  getCoordinates$(
    zip: string,
    city: string,
    street: string,
    houseNumber: string,
    country: string = null
  ): Observable<Array<number>> {
    let url =
      'https://nominatim.openstreetmap.org/search?street=' +
      street +
      ' ' +
      houseNumber +
      '&postalcode=' +
      zip +
      '&city=' +
      city;
    if (country) {
      url = url + '&country=' + country;
    }
    url = url + '&format=jsonv2';

    return this.http
      .get<Array<any>>(url)
      .pipe(map((x) => new Array<number>(x[0].lat, x[0].lon)));
  }

  findCoordinatesByAddress(searchString: string): Observable<Array<number>> {
    return this.http
      .get<any>(
        'https://public.opendatasoft.com/api/records/1.0/search/?dataset=postleitzahlen-deutschland&q=' +
          encodeURIComponent(searchString) +
          '&facet=note&facet=plz'
      )
      .pipe(map((x) => x.records[0].geo_point_2d));

    // "records":[
    //   {
    //     "datasetid":"postleitzahlen-deutschland",
    //     "recordid":"16a2fa27f5f8ac99ea043808ec16591ef21c6ee4",
    //     "fields": {
    //       "note":"Dortmund",
    //       "geo_shape": {
    //         "type":"Polygon",
    //         "coordinates":[
    //           [(too many elements to preview)]
    //         ]
    //       },
    //       "geo_point_2d":[
    //         51.51248317666277,
    //         7.374578158476884
    //       ],
    //       "plz":"44379"
    //     },
    //     "geometry": {
    //       "type":"Point",
    //       "coordinates":[
    //         7.374578158476884,
    //         51.51248317666277
    //       ]
    //     },
    //     "record_timestamp":"2017-03-25T06:26:36.889000+00:00"
    //   }]
  }

  getPostalAndCityByLocation(location: Array<number>) {
    const loc = encodeURIComponent(location[0] + ',' + location[1]);
    const url =
      'https://api.opencagedata.com/geocode/v1/json?key=8cf06bcf900d48fdb16f767a6a0e5cd8&q=' +
      loc +
      '&pretty=1&no_annotations=1';

    return this.http.get(url);
  }

  private formatJsonV2Result(result: Array<any>): Array<number> {
    if (result.length > 0) {
      return new Array<number>(result[0].lat, result[0].lon);
    } else {
      return new Array<number>();
    }
  }
}
