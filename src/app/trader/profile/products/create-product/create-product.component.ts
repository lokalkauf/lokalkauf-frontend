import { Component, Input, Inject, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { TraderService } from 'src/app/services/trader.service';
import { UserService } from 'src/app/services/user.service';
import { first, map, flatMap, tap } from 'rxjs/operators';
import { ProductService } from '../../../../services/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../../models/product';
import { ImageService } from 'src/app/services/image.service';
import { BrowserService } from 'src/app/services/browser.service';

export interface ProductDialogData {
  product?: Product;
}

@Component({
  selector: 'lk-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0.01), Validators.max(10000), Validators.pattern('^[0-9]*(.|,)?[0-9]?[0-9]?$')]),
    description: new FormControl('', [Validators.nullValidator]),
    image: new FormControl(null),
  });

  imagePlaceholderUrl: string;
  imageUploadState?: Observable<number>;
  isBrowserSupported: boolean;
  browserName: string;

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    private snackBar: MatSnackBar,
    private user: UserService,
    private products: ProductService,
    private imageService: ImageService,
    private browserService: BrowserService,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) {
    if (data.product) {
      this.productForm.get('name').setValue(data.product.name);
      this.productForm.get('price').setValue(data.product.price);
      this.productForm.get('description').setValue(data.product.description);
      if (this.data.product.defaultImagePath) {
        this.imageService.getImage(this.data.product.defaultImagePath).then((image) => {
          this.imagePlaceholderUrl = image.url;
          console.log(this.imagePlaceholderUrl);
        });
      }
      this.productForm.markAsPristine();
    }
    this.isBrowserSupported = browserService.isBrowserSupported();
    this.browserName = browserService.getCurrentBrowser();
  }

  async onSubmit() {
    await this.user.loggedInUserState$
      .pipe(
        first(),
        flatMap(async (loggedInUserState) =>
          // if product exists update product else create product
          this.data.product != null ? this.updateProduct(loggedInUserState.uid, this.data.product.id) : this.createProduct(loggedInUserState.uid)
        ),
        flatMap(([userId, productId]) =>
          // if image input is dirty upload image
          this.productForm.get('image').dirty ? this.updateImage(userId, productId) : of(null)
        )
      )
      .subscribe(() => {
        this.snackBar.open(this.data.product ? 'Produkt erfolgreich bearbeitet!' : 'Produkt erfolgreich angelegt!', undefined, {
          duration: 5000,
        });

        this.dialogRef.close();
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

  private async createProduct(userId: string): Promise<[string, string]> {
    const name = this.productForm.get('name').value;
    const price = Number.parseFloat(this.productForm.get('price').value ? (this.productForm.get('price').value as string).replace(',', '.') : '');
    const description = this.productForm.get('description').value;

    const product = await this.products.createProduct(userId, {
      name,
      price,
      description,
    });
    return [userId, product.id];
  }

  private async updateProduct(userId: string, productId: string): Promise<[string, string]> {
    const name = this.productForm.get('name').value;
    const priceString = '' + this.productForm.get('price').value;
    const price = Number.parseFloat(priceString ? priceString.replace(',', '.') : '');
    const description = this.productForm.get('description').value;

    const product = await this.products.updateProduct(userId, productId, {
      name,
      price,
      description,
    });
    return [userId, productId];
  }

  private async updateImage(userId: string, productId: string) {
    const task = this.imageService.uploadProductImage(userId, productId, this.productForm.get('image').value);
    this.imageUploadState = task.percentageChanges();
    const imagePath = (await task).ref.fullPath;

    console.log(imagePath);

    await this.products.updateProduct(userId, productId, {
      defaultImagePath: imagePath,
    });
    this.imageUploadState = null;
  }
}
