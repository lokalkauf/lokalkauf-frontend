import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-item',
  template: `
      <a [routerLink]="'/product-detail/' + id">
        <mat-card class="product-item">
          <div class="image-wrapper">
            <img class="product-item-image" [src]="imageUrl">
          </div>
          <mat-card-header>
            <mat-card-title>{{ name }}</mat-card-title>
          </mat-card-header>
        </mat-card>
      </a>
  `,
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() id: string;
  @Input() name: string;
  @Input() imageUrl: string;

  constructor() { }

  ngOnInit(): void {}

}
