import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product$: Observable<any>;
  constructor(private db: AngularFirestore, private route: ActivatedRoute) {
    this.product$ = this.route.params.pipe(
      flatMap(params => {
        const id = params['id'];
        return db.collection('Products').doc(id).get().pipe(map(x => x.data()), tap(x => console.log(x)));
      })
    );
  }

  ngOnInit(): void {
  }

}
