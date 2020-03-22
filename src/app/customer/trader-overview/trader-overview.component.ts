import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trader } from '../../models/trader';

@Component({
  selector: 'app-trader-overview',
  templateUrl: './trader-overview.component.html',
  styleUrls: ['./trader-overview.component.scss']
})
export class TraderOverviewComponent {
  traders$: Observable<Trader[]>;
  constructor(db: AngularFirestore) {
    this.traders$ = db.collection<Trader>('Traders').valueChanges();
  }

}
