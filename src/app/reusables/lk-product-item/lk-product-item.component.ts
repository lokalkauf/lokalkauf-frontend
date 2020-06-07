import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ImageService } from 'src/app/services/image.service';

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

  imageUrl: string;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    if (this.product.defaultImagePath) {
      this.imageService
        .getThumbnailUrl(this.product.defaultImagePath)
        .then((thumbnailUrl) => {
          this.imageUrl = thumbnailUrl;
        });
    }
  }
}
