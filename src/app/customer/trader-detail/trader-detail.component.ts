import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

interface Trader {
  id: string;
  name: string;
  products: string[];
}

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss']
})
export class TraderDetailComponent implements OnInit {

  trader$: Observable<Trader>;
  constructor(private db: AngularFirestore, private route: ActivatedRoute) {
    this.trader$ = this.route.params.pipe(
      flatMap(params =>
        this.db.collection('Traders').doc<Trader>(params.id).valueChanges()
      )
    );
  }

  ngOnInit(): void {
  }

}
