import { Component, OnInit, Input } from '@angular/core';
import { Trader } from '../../models/trader';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent implements OnInit {
  @Input() trader: Trader;

  productAmount$: Observable<number>;

  constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.productAmount$ = this.db
      .collection<Omit<Trader, 'id'>>(`Traders/${this.trader.id}/Products`)
      .get()
      .pipe(map((snap) => snap.size));
  }
}
