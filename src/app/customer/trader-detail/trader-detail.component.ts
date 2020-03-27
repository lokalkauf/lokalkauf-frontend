import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Trader } from '../../models/trader';
import { CarouselEntry } from 'src/app/models/carouselEntry';
import { Link } from 'src/app/models/link';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss'],
})
export class TraderDetailComponent implements OnInit {
  trader$: Observable<Trader>;
  productAmount$: Observable<number>;
  carouselSlides: Array<CarouselEntry> = new Array<CarouselEntry>();

  constructor(private db: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.trader$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection('Traders')
          .doc<Omit<Trader, 'id'>>(params.id)
          .valueChanges()
          .pipe(map((x) => ({ ...x, id: params.id })))
      )
    );

    this.productAmount$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection<Omit<Trader, 'id'>>(`Traders/${params.id}/Products`)
          .get()
          .pipe(map((snap) => snap.size))
      )
    );

    // For Demo purposes:
    const carouselEntry = new CarouselEntry('/assets/start-image.png');
    carouselEntry.setLink(new Link('go to start page', '/', true));
    this.carouselSlides.push(carouselEntry);
    this.carouselSlides.push(
      new CarouselEntry('/assets/start-image.png', 'Test description')
    );
  }
}
