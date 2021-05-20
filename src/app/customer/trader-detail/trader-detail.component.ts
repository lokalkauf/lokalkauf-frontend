import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TraderProfile } from '../../models/traderProfile';
import { Trader } from '../../models/trader';
import { ImageService } from '../../services/image.service';
import { StorageService } from '../../services/storage.service';

import { AngularFireAnalytics } from '@angular/fire/analytics';

import { GalleryItem, ImageItem } from '@ngx-gallery/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss'],
})
export class TraderDetailComponent implements OnInit {
  trader$: Observable<Omit<TraderProfile, 'id'>>;
  productAmount$: Observable<number>;

  traderMoneyshotImages$: Observable<GalleryItem[]>;

  traderImages$: Observable<string[]>;
  products$: Observable<Array<Product>>;

  showMoreText = false;
  traderid: string;
  traderLoadingStateSuccessful$: Observable<boolean>;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private router: Router,
    private storageService: StorageService,
    private analytics: AngularFireAnalytics,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.trader$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection('Traders')
          .doc<Omit<TraderProfile, 'id'>>(params.id)
          .valueChanges()
          .pipe(
            tap((trader) => {
              this.traderid = params.id;
              this.traderLoadingStateSuccessful$ = of(!!trader);
              if (trader) {
                this.analytics.logEvent('trader_detail', {
                  trader: trader.businessname,
                  city: trader.city,
                  distance: trader.currentDistance,
                });
              } else {
                this.analytics.logEvent('trader_detail', {
                  tader: 'unknown trader was loaded',
                });
              }
            }),
            map((trader) =>
              trader
                ? {
                    ...trader,
                    homepage: this.getCorrectUrl(trader.homepage),
                    id: params.id,
                    loadSuccess: true,
                  }
                : ({} as TraderProfile)
            )
          )
      )
    );

    this.traderMoneyshotImages$ = this.route.params.pipe(
      flatMap(async (params) => {
        const images = await this.imageService.getAllTraderImageUrls(params.id);
        return images.map((img) => new ImageItem({ src: img }));
      })
    );

    this.products$ = this.route.params.pipe(flatMap((params) => this.productService.getProductsOfTrader(params.id)));

    this.traderImages$ = this.route.params.pipe(
      flatMap(
        async (params) => {
          const images = await this.imageService.getAllTraderImageUrls(params.id);
          return images;
        }

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
    this.changeUrl();
  }

  changeUrl() {
    // Change URL to /trader-detail/id. This is needed in case we were redirected
    // form the function traderDetail
    history.replaceState(null, '', '/trader-detail/' + this.route.snapshot.params.id);
  }

  getCorrectUrl(url?: string) {
    if (url) {
      const lowerurl = url.toLowerCase();
      return !lowerurl.startsWith('http') ? 'https://' + lowerurl : lowerurl;
    }
    return url;
  }

  getSomeUrl() {
    return 'https://' + window.location.host + '/trader-detail/' + this.traderid;
  }

  shortenText(inputText: string) {
    if (inputText.length > 200) {
      return inputText.substring(0, 200);
    } else {
      return inputText;
    }
  }

  navigateBackToOverview() {
    const city = this.storageService.loadLocation();
    if (city) {
      this.router.navigate(['/localtraders', city.coordinates[0], city.coordinates[1], city.radius ? city.radius : 10]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
