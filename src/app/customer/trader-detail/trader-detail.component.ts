import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CarouselEntry } from 'src/app/models/carouselEntry';
import { Link } from 'src/app/models/link';
import { TraderProfile } from 'src/app/models/traderProfile';
import { Trader } from 'src/app/models/trader';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss'],
})
export class TraderDetailComponent implements OnInit {
  trader$: Observable<Omit<TraderProfile, 'id'>>;
  productAmount$: Observable<number>;
  carouselSlides: Array<CarouselEntry> = new Array<CarouselEntry>();

  showMoreText = false;

  constructor(private db: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.trader$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection('Traders')
          .doc<Omit<TraderProfile, 'id'>>(params.id)
          .valueChanges()
          .pipe(
            tap(console.log),
            map((x) => ({ ...x, id: params.id }))
          )
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

  shortenText(inputText: string) {
    if (inputText.length > 200) {
      return inputText.substring(0, 200);
    } else {
      return inputText;
    }
  }
}
