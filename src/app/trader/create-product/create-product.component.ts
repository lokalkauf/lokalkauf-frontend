import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../../models/product';
import { Trader } from '../../models/trader';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  @Input() traderId: string;

  productForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(0.01),
      Validators.pattern('^[0-9]*\.?[0-9]?[0-9]?$')
    ]),
    description: new FormControl('', [
      Validators.nullValidator
    ])
  });

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    const name = this.productForm.get('name').value;
    const category = this.productForm.get('category').value;
    const price = Number.parseFloat(this.productForm.get('price').value);
    const description = this.productForm.get('description').value;

    const added = await this.db.collection<Omit<Product, 'id'>>('Products').add({
      name,
      price,
      image: ''
    });

    const doc = await this.db.collection<Omit<Trader, 'id'>>('Traders').doc(this.traderId).get().toPromise();
    doc
    await this.db.collection<Omit<Trader, 'id'>>('Traders').doc(this.traderId).update({})
  }

}
