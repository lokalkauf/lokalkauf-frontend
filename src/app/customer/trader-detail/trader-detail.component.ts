import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Trader } from '../../models/trader';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss']
})
export class TraderDetailComponent implements OnInit {
  trader$: Observable<Trader>;
  productAmount$: Observable<number>;

  constructor(db: AngularFirestore, private route: ActivatedRoute) {
    this.trader$ = this.route.params.pipe(
      flatMap(params =>
        db
          .collection('Traders')
          .doc<Omit<Trader, 'id'>>(params.id)
          .valueChanges()
          .pipe(map(x => ({ ...x, id: params.id })))
      )
    );

    this.productAmount$ = this.route.params.pipe(
      flatMap(params =>
        db
          .collection<Omit<Trader, 'id'>>(`Traders/${params.id}/Products`)
          .get()
          .pipe(map(snap => snap.size))
      )
    );
  }

  ngOnInit(): void {}
}
