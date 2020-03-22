import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { TraderMainComponent } from './trader-main/trader-main.component';



@NgModule({
  declarations: [
    OrdersComponent,
    CreateProductComponent,
    TraderMainComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TraderModule { }
