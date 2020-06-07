import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ShoppingcartService } from '../../services/shoppingcart.service';
import { ProductService } from '../../services/product.service';
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

  addToCart(productId: string): void {
    this.cartService.add({
      count: 1,
      productId,
      traderId: this.traderId,
    });

    this.snackBar.openFromComponent(ProductDetailFeedbackComponent, {
      duration: 3000,
      panelClass: ['snackbar'],
    });
  }
}
