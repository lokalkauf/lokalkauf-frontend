import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-item',
  template: `
      <mat-card class="product-item">
        <img class="product-item-image" [src]="imageUrl">
        <mat-card-header>
          <mat-card-title>{{ name }}</mat-card-title>
        </mat-card-header>
      </mat-card>
  `,
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() name: string;
  @Input() imageUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
