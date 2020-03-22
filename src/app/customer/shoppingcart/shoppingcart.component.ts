import { Component, OnInit } from '@angular/core';
import { ShoppingcartService } from 'src/app/services/shoppingcart.service';
import { CartEntry } from 'src/app/models/cartEntry';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit {
  cartEntries: Array<CartEntry>;

  constructor(private cartService: ShoppingcartService) { }

  ngOnInit(): void {
    this.cartEntries = this.cartService.get();
  }

}
