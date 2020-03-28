import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ShoppingcartService } from 'src/app/services/shoppingcart.service';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDetailFeedbackComponent } from '../product-detail-feedback/product-detail-feedback.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product>;
  traderId: string;

  constructor(
    private route: ActivatedRoute,
    private cartService: ShoppingcartService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      tap((params) => (this.traderId = params.traderId)),
      flatMap((params) =>
        this.productService.getProduct(params.traderId, params.productId)
      )
    );
  }

  addToCart(product: Product): void {
    this.cartService.add({
      count: 1,
      productId: product.id,
      traderId: this.traderId,
    });

    this.snackBar.openFromComponent(ProductDetailFeedbackComponent, {
      duration: 3000,
      panelClass: ['snackbar'],
    });
  }
}
