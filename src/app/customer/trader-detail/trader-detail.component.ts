import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, Subscription } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselEntry } from 'src/app/models/carouselEntry';
import { Link } from 'src/app/models/link';
import { TraderProfile } from 'src/app/models/traderProfile';
import { Trader } from 'src/app/models/trader';
import { EMail } from '../../models/email';
import { EMailService } from '../../services/email.service';
import { ErrorService } from 'src/app/services/error.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss'],
})
export class TraderDetailComponent implements OnInit, OnDestroy {
  trader$: Observable<Omit<TraderProfile, 'id'>>;
  traderImages$: any;
  productAmount$: Observable<number>;
  carouselSlides: Array<CarouselEntry> = new Array<CarouselEntry>();

  showMoreText = false;
  urlChangeSubscriptionForImages: Subscription = null;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private mailService: EMailService,
    private router: Router,
    private errorService: ErrorService,
    private storage: AngularFireStorage
  ) {}

  ngOnDestroy(): void {
    if (this.urlChangeSubscriptionForImages) {
      this.urlChangeSubscriptionForImages.unsubscribe();
      this.urlChangeSubscriptionForImages = null;
    }
  }

  ngOnInit(): void {
    this.trader$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection('Traders')
          .doc<Omit<TraderProfile, 'id'>>(params.id)
          .valueChanges()
          .pipe(map((x) => ({ ...x, id: params.id })))
      )
    );

    // TODO - darkblackside - 29.03.2020 21:47 - make this better, now it is combining observables with promises. Not the optimal way
    this.urlChangeSubscriptionForImages = this.route.params.subscribe(
      (params) => {
        this.storage.storage
          .ref()
          .child('Traders/' + params.id + '/BusinessImages')
          .list()
          .then((files) => {
            this.carouselSlides = new Array<CarouselEntry>();
            files.items.forEach((oneFile) => {
              oneFile.getDownloadURL().then((imageUrl) => {
                const carouselSlide = new CarouselEntry(imageUrl);
                this.carouselSlides.push(carouselSlide);
              });
            });
          });
      }
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

  shortenText(inputText: string) {
    if (inputText.length > 200) {
      return inputText.substring(0, 200);
    } else {
      return inputText;
    }
  }
}
