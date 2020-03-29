import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trader } from '../../models/trader';
import { ActivatedRoute } from '@angular/router';

import { GeoService } from 'src/app/services/geo.service';
import { TraderService } from 'src/app/services/trader.service';

@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component.html',
  styleUrls: ['./trader-overview.component.scss'],
})
export class TraderOverviewComponent implements OnInit {
  traders$: Observable<Trader[]>;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService
  ) {
    this.traders$ = db
      .collection<Omit<Trader, 'id'>>('Traders')
      .valueChanges({ idField: 'id' });

    // this.traderService.getTraderProfiles(['',''])
    // .subscribe(t => {
    //   console.log(t);
    // });
  }

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
}
