import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trader } from '../../models/trader';
import { Location } from 'src/app/models/location';
import { ActivatedRoute } from '@angular/router';

import { GeoService } from 'src/app/services/geo.service';
import { TraderService } from 'src/app/services/trader.service';
import { TraderProfile } from 'src/app/models/traderProfile';

@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component.html',
  styleUrls: ['./trader-overview.component.scss'],
})
export class TraderOverviewComponent implements OnInit {
  traders$: Array<TraderProfile> = new Array<TraderProfile>();
  // traders$: Observable<TraderProfile[]>;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('lat' + params.lat + ' lng: ' + params.lng);

      try {
        const pos = [
          Number.parseFloat(params.lat),
          Number.parseFloat(params.lng),
        ];
        this.geo.setUserPosition(pos);
      } catch {
        console.log('no location available');
      }
    });
  }

  updateLocations(trlocaitons: Array<Location>) {
    console.log('UÖDATESASDFADF: ' + trlocaitons.length);

    // a lot of magic, couse of firebase limitation loading 10 ids in query at once
    const ids = trlocaitons.map((l) => l.traderId);
    const chunked = this.getChunks(ids, 10);
    console.log(chunked);

    this.traders$.forEach((t) => {
      this.traders$.pop();
    });

    this.traders$ = new Array<TraderProfile>();

    console.log('traders removed: ' + this.traders$.length);

    for (const chunk of chunked) {
      this.traderService
        .getTraderProfiles(chunk)
        .subscribe((t: TraderProfile[]) => {
          console.log('loading of trader done.');
          if (t && t.length > 0) {
            console.log('trader loaded: ' + t.length);

            t.forEach((trader) => {
              this.traders$.push(trader);
            });
          }
        });
    }

    // const arr = [];

    // for (const chunk of chunked) {
    //   arr.push(this.traderService.getTraderProfiles(chunk));
    // }

    // forkJoin(arr).subscribe(data => {
    //   console.log('chunks loaded...');
    //   console.log(s);
    // });
  }

  getChunks(arr, size) {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) {
        acc.push(arr.slice(i, i + size));
      }

      return acc;
    }, []);
  }
}
