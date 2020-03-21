import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent {
  items$: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.items$ = db.collection('Products').valueChanges();
  }
}
