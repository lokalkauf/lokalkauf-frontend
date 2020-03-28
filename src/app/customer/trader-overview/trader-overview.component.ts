import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trader } from '../../models/trader';
import { ActivatedRoute } from '@angular/router';

import { GeoService } from 'src/app/services/geo.service';


@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component.html',
  styleUrls: ['./trader-overview.component.scss'],
})
export class TraderOverviewComponent {
  traders$: Observable<Trader[]>;
  
  
  constructor(db: AngularFirestore, private route: ActivatedRoute, private geo: GeoService) {
    this.traders$ = db
      .collection<Omit<Trader, 'id'>>('Traders')
      .valueChanges({ idField: 'id' });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
       params['lat'];
       console.log('lat' + params['lat'] + " lng: " + params['lng']);

       try {
          const pos = [Number.parseFloat(params['lat']), Number.parseFloat(params['lng'])];
          this.geo.setUserPosition(pos);
       }
       catch       
       {
         console.log('no location available');
       }

       
    });
  }

}
