import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, Reference } from '@angular/fire/firestore';
import { Observable, from, Subscription, defer } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Link } from 'src/app/models/link';
import { TraderProfile } from 'src/app/models/traderProfile';
import { Trader } from 'src/app/models/trader';
import { EMail } from '../../models/email';
import { EMailService } from '../../services/email.service';
import { ErrorService } from 'src/app/services/error.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { TraderService } from 'src/app/services/trader.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss'],
})
export class TraderDetailComponent implements OnInit {
  trader$: Observable<Omit<TraderProfile, 'id'>>;
  productAmount$: Observable<number>;
  traderImages$: Observable<string[]>;

  showMoreText = false;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.trader$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection('Traders')
          .doc<Omit<TraderProfile, 'id'>>(params.id)
          .valueChanges()
          .pipe(
            map((x) => ({
              ...x,
              homepage: this.getCorrectUrl(x.homepage),
              id: params.id,
            }))
          )
      )
    );

    this.traderImages$ = this.route.params.pipe(
      flatMap(
        async (params) =>
          await this.imageService.getAllTraderImageUrls(params.id)
        // this.traderService.getTraderBusinessImageUrls(params.id)
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
  }

  getCorrectUrl(url?: string) {
    if (url) {
      const lowerurl = url.toLowerCase();
      return !lowerurl.startsWith('http') ? 'http://' + lowerurl : lowerurl;
    }
    return url;
  }

  shortenText(inputText: string) {
    if (inputText.length > 200) {
      return inputText.substring(0, 200);
    } else {
      return inputText;
    }
  }
}
