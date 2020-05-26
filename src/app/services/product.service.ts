import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private db: AngularFirestore,
    private analytics: AngularFireAnalytics
  ) {
    this.analytics.logEvent('product_service');
  }

  public getProduct(traderId: string, productId: string): Observable<any> {
    return this.db
      .collection(`Traders/${traderId}/Products`)
      .doc<Omit<Product, 'id'>>(productId)
      .valueChanges()
      .pipe(map((x) => ({ ...x, id: productId })));
  }
}
