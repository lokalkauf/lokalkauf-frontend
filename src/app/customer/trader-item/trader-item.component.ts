import { Component, OnInit, Input } from '@angular/core';
import { Trader } from '../../models/trader';

@Component({
  selector: 'app-trader-item',
  template: `
      <a [routerLink]="'/trader-detail/' + trader.id">
        <mat-card class="trader-item">
          <div class="image-wrapper" mat-card-image [ngStyle]="{'background-image': 'url(' + trader.image + ')'}">
          </div>
          <mat-card-content>
            <p class="title">{{ trader.name }}</p>
            <p><span class="product-amount">{{ trader.products.length }}</span> Produkte</p>
          </mat-card-content>
        </mat-card>
      </a>
  `,
  styleUrls: ['./trader-item.component.scss']
})
export class TraderItemComponent implements OnInit {

  @Input() trader: Trader;

  constructor() { }

  ngOnInit(): void {}

}
