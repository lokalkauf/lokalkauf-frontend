import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartEntry } from '../models/cartEntry';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartService {
  private cartItems: Array<CartEntry> = null;

  constructor(private db: AngularFirestore) {
  }

  get(userId: string): CartEntry[] {
    if (this.cartItems == null && localStorage.getItem('cart')) {
      this.cartItems = JSON.parse(localStorage.getItem('cart'));
    } else if (this.cartItems == null) {
      this.cartItems = new Array<CartEntry>();
    }

    return this.cartItems;
  }

  add(cartEntry: CartEntry) {
    this.cartItems.push(cartEntry);
    this.saveInLocalstorage();
  }

  delete(cartEntry: CartEntry) {
    const foundIndex = this.cartItems.findIndex(x => x === cartEntry);

    if (foundIndex >= 0) {
      this.cartItems = this.cartItems.splice(foundIndex, 1);
    }
    this.saveInLocalstorage();
  }

  update(cartEntry: CartEntry) {
    const foundIndex = this.cartItems.findIndex(x => x === cartEntry);

    this.cartItems[foundIndex] = cartEntry;
    this.saveInLocalstorage();
  }

  private saveInLocalstorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
