import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, tap, flatMap } from 'rxjs/operators';
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

  public updateProduct(
    traderId: string,
    productId: string,
    product: Partial<Product>
  ) {
    return this.db
      .collection<Product>(`Traders/${traderId}/Products`)
      .doc<Product>(productId)
      .update(product);
  }

  public getProductsOfTrader(
    traderId: string
  ): Observable<Array<Product & { id: string }>> {
    return this.db
      .collection<Product>(`Traders/${traderId}/Products`)
      .valueChanges({ idField: 'id' });
  }

  public removeProuct(traderId: string, productId: string) {
    return this.db
      .collection<Product>(`Traders/${traderId}/Products`)
      .doc(productId)
      .delete();
  }
}
