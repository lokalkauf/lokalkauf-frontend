import { Component, OnInit, Input } from '@angular/core';
import { CartEntry } from 'src/app/models/cartEntry';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { tap } from 'rxjs/operators';
import { ShoppingcartService } from 'src/app/services/shoppingcart.service';

@Component({
  selector: 'app-shoppingcart-item',
  templateUrl: './shoppingcart-item.component.html',
  styleUrls: ['./shoppingcart-item.component.scss']
})
export class ShoppingcartItemComponent implements OnInit {
  @Input() cartEntry: CartEntry;
  productDetails$: Observable<Product>;

  constructor(private productService: ProductService, private cartService: ShoppingcartService) { }

  ngOnInit(): void {
    this.productDetails$ = this.productService.getProduct(this.cartEntry.traderId, this.cartEntry.productId).pipe(tap(console.log));
  }

  addCount(cartItem: CartEntry, count: number) {
    if (cartItem.count + count > 0) {
      cartItem.count += count;
      this.cartService.saveChanges();
    }
  }

  deleteItem(cartItem: CartEntry) {
    this.cartService.delete(cartItem);
  }
}
