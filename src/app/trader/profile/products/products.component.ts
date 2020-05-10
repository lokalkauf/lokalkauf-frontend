import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponent } from './create-product/create-product.component';

@Component({
  selector: 'lk-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  createDialog() {
    this.dialog.open(CreateProductComponent, { disableClose: true });
  }
}
