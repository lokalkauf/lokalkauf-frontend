import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trader } from '../../models/trader';
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
  traders$: Observable<TraderProfile[]>;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private geo: GeoService,
    private traderService: TraderService
  ) {
    this.traders$ = this.traderService.getTraderProfiles([
      '14zQgp6I6afO54FkUUY54CtNYd92',
      'l1ByOLFIvaPlm8JsqLetNWHlCcA2',
    ]);
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
