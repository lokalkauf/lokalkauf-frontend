import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product$: Observable<Product>;
  
  constructor(db: AngularFirestore, private route: ActivatedRoute) {
    this.product$ = this.route.params.pipe(
      flatMap(params =>  db.collection('Products').doc<Product>(params.id).valueChanges())
    );
  }

  ngOnInit(): void {
  }

}
