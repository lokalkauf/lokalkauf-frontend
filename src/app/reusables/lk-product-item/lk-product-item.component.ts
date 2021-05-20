import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { iif, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
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

  imageUrl$: Observable<string>;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.imageUrl$ = of(this.product.defaultImagePath).pipe(flatMap((image) => (image == null ? of('/assets/lokalkauf-pin.svg') : this.imageService.waitForThumbnailUrl(image))));
  }
}
