import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-item',
  template: `
      <a [routerLink]="'/product-detail/' + id">
        <mat-card class="product-item">
          <div class="image-wrapper" mat-card-image [ngStyle]="{'background-image': 'url(' + imageUrl + ')'}">
          </div>
          <mat-card-content>
            <p class="title">{{ name }}</p>
            <p class="price">
              {{ price }} €
              <mat-icon class="shopping-cart-icon">shopping_cart</mat-icon>
            </p>
          </mat-card-content>
        </mat-card>
      </a>
  `,
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() id: string;
  @Input() name: string;
  @Input() imageUrl: string;
  @Input() price: number;

  constructor() { }

  ngOnInit(): void {}

}
