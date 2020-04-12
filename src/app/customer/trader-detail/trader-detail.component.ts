import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TraderProfile } from '../../models/traderProfile';
import { Trader } from '../../models/trader';
import { ImageService } from '../../services/image.service';
import { Lightbox } from 'ngx-lightbox';

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
  private lightBoxItems = [];

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private lightbox: Lightbox
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
        async (params) => {
          const images = await this.imageService.getAllTraderImageUrls(
            params.id
          );

          if (images && images.length > 0) {
            images.forEach((i) =>
              this.lightBoxItems.push({
                src: i,
              })
            );
          }
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

  openLightbox(index: number): void {
    // open lightbox
    console.log('ich war hier: ' + index);
    this.lightbox.open(this.lightBoxItems, index);
  }
}
