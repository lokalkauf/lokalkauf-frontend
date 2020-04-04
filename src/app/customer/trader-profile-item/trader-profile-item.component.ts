import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Trader } from '../../models/trader';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { TraderProfile } from 'src/app/models/traderProfile';

@Component({
  selector: 'app-trader-profile-item',
  templateUrl: './trader-profile-item.component.html',
  styleUrls: ['./trader-profile-item.component.scss'],
})
export class TraderProfileItemComponent implements OnInit {
  @Input() trader: TraderProfile;

  constructor() {}

  ngOnInit(): void {}

  @HostBinding('style.backgroundImage')
  getThumbnail(trader: TraderProfile) {
    const url =
      trader && trader.thumbnailUrl
        ? trader.thumbnailUrl
        : './assets/lokalkauf-pin.png';

    return `url(${url})`;
  }
}
