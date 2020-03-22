import { Component, OnInit } from '@angular/core';
import { ShoppingcartService } from 'src/app/services/shoppingcart.service';
import { CartEntry } from 'src/app/models/cartEntry';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit {
  cartEntries: Array<CartEntry>;
  fullPrice: Array<number> = [];

  constructor(private cartService: ShoppingcartService) { }

  ngOnInit(): void {
    this.reload()
  }

  getFullPrice(): number {
    let total = 0;

    // tslint:disable-next-line: forin
    for (const key in this.fullPrice) {
      total += this.fullPrice[key];
    }

    return Math.round(total * 100) / 100;
  }

  updatedPrice(price: number, productId: string) {
    this.fullPrice[productId] = price;
  }

  deleteItem(cartItem: CartEntry) {
    this.cartService.delete(cartItem);
    //this.reload();
  }

  private reload() {
    this.cartEntries = this.cartService.get();
  }

}
