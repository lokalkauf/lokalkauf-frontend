import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'lk-product-item',
  templateUrl: './lk-product-item.component.html',
  styleUrls: ['./lk-product-item.component.scss'],
})
export class LkProductItemComponent implements OnInit {
  @Input() product: Product;
  @Input() enableInteraction: boolean;

  @Output() editClicked = new EventEmitter();
  @Output() removeClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
