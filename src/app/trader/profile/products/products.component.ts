import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { Observable, TimeoutError } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'lk-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products$: Observable<Array<Product & { id: string }>>;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private productService: ProductService
  ) {
    this.products$ = userService.getProducts();
  }

  ngOnInit(): void {}

  createDialog() {
    this.dialog.open(CreateProductComponent, { disableClose: true, data: {} });
  }

  removeProduct(productId: string) {
    this.productService.removeProuct(
      this.userService.getAuthenticatedUser().uid,
      productId
    );
  }

  editProduct(product: Product & { id: string }) {
    this.dialog.open(CreateProductComponent, {
      disableClose: true,
      data: { product },
    });
  }
}
