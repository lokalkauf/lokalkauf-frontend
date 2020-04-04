import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Trader } from '../../models/trader';
import { Observable, of, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, flatMap, distinctUntilChanged } from 'rxjs/operators';
import { TraderProfile } from 'src/app/models/traderProfile';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent implements OnInit {
  @Input() trader: Trader;

  productAmount$: Observable<number>;

  trader$: Observable<Omit<TraderProfile, 'id'>>;

  thumbnail$: Observable<string>;

  constructor(
    private db: AngularFirestore,
    private imageService: ImageService
  ) {}
  bgImageVariable: string;

  ngOnInit(): void {
    this.trader$ = this.db
      .collection('Traders')
      .doc<Omit<TraderProfile, 'id'>>(this.trader.id)
      .valueChanges()
      .pipe(
        map((trader) => {
          return {
            ...trader,
            id: this.trader.id,
          };
        })
      );

    this.thumbnail$ = this.trader$.pipe(
      map((trader) => trader.defaultImagePath),
      distinctUntilChanged(),
      flatMap(async (imagePath) =>
        imagePath
          ? (
              await this.imageService.getThumbnail(
                await this.imageService.getImage(imagePath)
              )
            ).url
          : './assets/lokalkauf-pin.png'
      )
    );
  }

  getThumbnail(trader: TraderProfile & { thumbnailUrl: string | null }) {
    if (trader) {
      return { 'background-image': `url(\' ${trader.thumbnailUrl}  \')` };
    }
  }
}
