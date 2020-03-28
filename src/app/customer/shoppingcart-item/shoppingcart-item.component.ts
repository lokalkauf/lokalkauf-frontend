import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartEntry } from 'src/app/models/cartEntry';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { tap } from 'rxjs/operators';
import { ShoppingcartService } from 'src/app/services/shoppingcart.service';

@Component({
  selector: 'app-shoppingcart-item',
  templateUrl: './shoppingcart-item.component.html',
  styleUrls: ['./shoppingcart-item.component.scss'],
})
export class ShoppingcartItemComponent implements OnInit {
  @Input() cartEntry: CartEntry;
  @Output() currentPrice: EventEmitter<number> = new EventEmitter<number>();
  @Output() deletedClicked: EventEmitter<void> = new EventEmitter<void>();
  productDetails$: Observable<Product>;

  constructor(
    private productService: ProductService,
    private cartService: ShoppingcartService
  ) {}

  ngOnInit(): void {
    this.productDetails$ = this.productService
      .getProduct(this.cartEntry.traderId, this.cartEntry.productId)
      .pipe(tap((x) => this.currentPrice.emit(x.price * this.cartEntry.count)));
  }

  addCount(cartItem: CartEntry, count: number, product: Product) {
    if (cartItem.count + count > 0) {
      cartItem.count += count;
      this.cartService.saveChanges();
      this.currentPrice.emit(product.price * this.cartEntry.count);
    }
  }

  clickDelete() {
    this.currentPrice.emit(0);
    this.deletedClicked.emit();
  }

  round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
