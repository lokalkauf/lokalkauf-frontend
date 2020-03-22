import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { Product } from '../../models/product';


@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent implements OnInit {

  @Input() productIds: string[];

  products$: Observable<Product[]>;
  constructor(private db: AngularFirestore) {
  }

  ngOnInit() {
    this.products$ = combineLatest(this.productIds.map(itemId =>
      this.db.collection('Products').doc<Product>(itemId).valueChanges()
    ));
  }
}
