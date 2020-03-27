import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartEntry } from '../models/cartEntry';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShoppingcartService {
  private cartItems: Array<CartEntry> = null;

  constructor(private db: AngularFirestore) {}

  get(): CartEntry[] {
    this.loadIfNull();

    return this.cartItems;
  }

  add(cartEntry: CartEntry) {
    this.loadIfNull();

    const foundItem = this.cartItems.find(
      (x) => x.productId === cartEntry.productId
    );
    if (foundItem) {
      foundItem.count += cartEntry.count;
    } else {
      this.cartItems.push(cartEntry);
    }

    this.saveChanges();
  }

  delete(cartEntry: CartEntry) {
    this.loadIfNull();

    const foundIndex = this.cartItems.findIndex(
      (x) => x.productId === cartEntry.productId
    );

    if (foundIndex >= 0) {
      this.cartItems.splice(foundIndex, 1);
    }
    this.saveChanges();
  }

  update(cartEntry: CartEntry) {
    this.loadIfNull();

    const foundIndex = this.cartItems.findIndex(
      (x) => x.productId === cartEntry.productId
    );

    this.cartItems[foundIndex] = cartEntry;
    this.saveChanges();
  }

  private loadIfNull() {
    if (this.cartItems == null && localStorage.getItem('cart')) {
      this.cartItems = JSON.parse(localStorage.getItem('cart'));
    } else if (this.cartItems == null) {
      this.cartItems = new Array<CartEntry>();
    }
  }

  saveChanges() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
