import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-item',
  template: `
      <a [routerLink]="'/product-detail/' + product.id">
        <mat-card class="product-item">
          <div class="image-wrapper" mat-card-image [ngStyle]="{'background-image': 'url(' + product.image + ')'}">
          </div>
          <mat-card-content>
            <p class="title">{{ product.name }}</p>
            <p class="price">
              {{ product.price }} €
            </p>
          </mat-card-content>
        </mat-card>
      </a>
  `,
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product;

  constructor() { }

  ngOnInit(): void {}

}
