import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Trader } from '../../models/trader';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { TraderProfile } from 'src/app/models/traderProfile';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent implements OnInit {
  @Input() trader: Trader;

  productAmount$: Observable<number>;

  trader$: Observable<Omit<TraderProfile, 'id'>>;

  constructor(private db: AngularFirestore) {}
  bgImageVariable: string;

  ngOnInit(): void {
    this.trader$ = this.db
      .collection('Traders')
      .doc<Omit<TraderProfile, 'id'>>(this.trader.id)
      .valueChanges()
      .pipe(
        map((x) => ({
          ...x,
          id: this.trader.id,
          thumbnailUrl: x.thumbnailUrl
            ? x.thumbnailUrl
            : './assets/lokalkauf-pin.png',
        }))
      );
  }

  getThumbnail(trader: TraderProfile) {
    if (trader) {
      return { 'background-image': `url(\' ${trader.thumbnailUrl}  \')` };
    }
  }
}
