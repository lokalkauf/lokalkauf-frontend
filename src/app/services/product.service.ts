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

  public getProduct(traderId: string, productId: string): Observable<Product> {
    return this.db
      .collection<Omit<Product, 'id'>>(`Traders/${traderId}/Products`)
      .doc<Omit<Product, 'id'>>(productId)
      .valueChanges()
      .pipe(map((x) => ({ ...x, id: productId })));
  }

  public createProduct(traderId: string, product: Omit<Product, 'id'>) {
    return this.db
      .collection<Omit<Product, 'id'>>(`Traders/${traderId}/Products`)
      .add(product);
  }

  public updateProduct(
    traderId: string,
    productId: string,
    product: Partial<Omit<Product, 'id'>>
  ) {
    return this.db
      .collection<Omit<Product, 'id'>>(`Traders/${traderId}/Products`)
      .doc<Omit<Product, 'id'>>(productId)
      .update(product);
  }

  public getProductsOfTrader(traderId: string): Observable<Array<Product>> {
    return this.db
      .collection<Omit<Product, 'id'>>(`Traders/${traderId}/Products`)
      .valueChanges({ idField: 'id' });
  }

  public removeProduct(traderId: string, productId: string) {
    return this.db
      .collection<Omit<Product, 'id'>>(`Traders/${traderId}/Products`)
      .doc(productId)
      .delete();
  }
}
