import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss'],
})
export class ProductOverviewComponent implements OnInit {
  @Input() traderId: string;

  products$: Observable<Array<Product>>;
  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.products$ = this.db
      .collection<Omit<Product, 'id'>>(`Traders/${this.traderId}/Products`)
      .valueChanges({ idField: 'id' });
  }
}
