import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private db: AngularFirestore) {}

  public getProduct(
    traderId: string,
    productId: string
  ): Observable<Product & { id: string }> {
    return this.db
      .collection<Product>(`Traders/${traderId}/Products`)
      .doc<Product>(productId)
      .valueChanges()
      .pipe(map((x) => ({ ...x, id: productId })));
  }

  public createProduct(traderId: string, product: Product) {
    return this.db
      .collection<Product>(`Traders/${traderId}/Products`)
      .add(product);
  }
}
