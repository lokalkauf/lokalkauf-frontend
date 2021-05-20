import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

export interface Coords {
  lng: number;
  lat: number;
}

@Injectable()
export class NavigationService {
  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService
  ) {}

  public getNavigationPath(coordsList: number[][]): Observable<any> {
    const apikey = environment.openrouteservice.apikey;
    if (!coordsList || !apikey) {
      return of(undefined);
    }

    const cacheKey = this.getCacheKey(coordsList);
    const loadedFromCache = this.storageService.loadCache(cacheKey);
    if (loadedFromCache) {
      return of(loadedFromCache);
    }

    const body = { coordinates: coordsList };
    return this.http
      .post(
        'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
        body,
        {
          headers: { Authorization: apikey },
        }
      )
      .pipe(
        tap((result) => {
          this.storageService.saveCache(cacheKey, result as string);
        }),
        catchError(this.handleError)
      );
  }

  getCacheKey(coordsList: number[][]): string {
    return coordsList
      .map((x) => x[0] + '-' + x[1])
      .reduce((a, b) => a.concat(b) + '-', '');
  }

  private handleError(error: HttpErrorResponse) {
    console.log('navi:', error);
    return throwError('navigation error');
  }
}
