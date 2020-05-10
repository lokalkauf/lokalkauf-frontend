import { Component, Input } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TraderService } from 'src/app/services/trader.service';
import { UserService } from 'src/app/services/user.service';
import { first, map, flatMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'lk-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern('^[0-9]*.?[0-9]?[0-9]?$'),
    ]),
    description: new FormControl('', [Validators.nullValidator]),
    image: new FormControl(null, Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    private snackBar: MatSnackBar,
    private user: UserService,
    private products: ProductService
  ) {}

  async onSubmit() {
    const name = this.productForm.get('name').value;
    const price = Number.parseFloat(this.productForm.get('price').value);
    const description = this.productForm.get('description').value;

    await this.user.loggedInUserState$
      .pipe(
        first(),
        flatMap((loggedInUserState) => {
          console.log(loggedInUserState.uid);
          return this.products.createProduct(loggedInUserState.uid, {
            name,
            price,
            description,
            image: '',
          });
        })
      )
      .toPromise();

    this.snackBar.open('Produkt erflogreich angelegt!', undefined, {
      duration: 5000,
    });
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
