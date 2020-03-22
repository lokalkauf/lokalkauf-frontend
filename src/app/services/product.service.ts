import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore) { }

  public getProduct(traderId: string, productId: string): Observable<any> {
    return this.db.collection(`Traders/${traderId}/Products`)
              .doc<Omit<Product, 'id'>>(productId)
              .valueChanges()
              .pipe(map(x => ({ ...x, id: productId })));
  }
}
