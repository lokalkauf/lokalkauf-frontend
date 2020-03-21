import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { CreateProductComponent } from './create-product/create-product.component';



@NgModule({
  declarations: [
    OrdersComponent,
    CreateProductComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TraderModule { }
