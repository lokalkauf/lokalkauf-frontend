import { Component, Input } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../../models/product';
import { AngularFireStorage } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  @Input() traderId: string;

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern('^[0-9]*.?[0-9]?[0-9]?$'),
    ]),
    description: new FormControl('', [Validators.nullValidator]),
    file: new FormControl(''),
  });

  uploadState?: Observable<number>;
  uploadedImage?: string;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  async onSubmit() {
    const name = this.productForm.get('name').value;
    const price = Number.parseFloat(this.productForm.get('price').value);
    const description = this.productForm.get('description').value;

    const product = await this.db
      .collection<Omit<Product, 'id'>>(`Traders/${this.traderId}/Products`)
      .add({
        name,
        price,
        image: this.uploadedImage ? this.uploadedImage : '',
        description,
      });

    this.router.navigateByUrl(
      `/trader/${this.traderId}/product-detail/${product.id}`
    );
  }

  async uploadImage(event) {
    const file = event.target.files[0];
    const filePath = `${this.traderId}/${uuid()}-${file}`;
    const task = this.storage.upload(filePath, file);
    this.uploadState = task.percentageChanges();
    await task.then(async (snapshot) => {
      this.uploadedImage = await snapshot.ref.getDownloadURL();
      this.uploadState = null;
    });
  }
}
