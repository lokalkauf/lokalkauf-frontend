import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
import { BuyConfirmationComponent } from './buy-confirmation/buy-confirmation.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { TraderOverviewComponent } from './trader-overview/trader-overview.component';
import { TraderItemComponent } from './trader-item/trader-item.component';
import { TraderDetailComponent } from './trader-detail/trader-detail.component';
import { TraderMapComponent } from './trader-map/trader-map.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingcartItemComponent } from './shoppingcart-item/shoppingcart-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductDetailFeedbackComponent } from './product-detail-feedback/product-detail-feedback.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TraderContactComponent } from './trader-contact/trader-contact.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { InquiryConfirmationComponent } from './inquiry-confirmation/inquiry-confirmation.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { PipesModule } from '../pipes/pipes.modules';

const routes: Routes = [
  {
    path: 'trader/:traderId/product-detail/:productId',
    component: ProductDetailComponent,
  },
  { path: 'buy/confirmation', component: BuyConfirmationComponent },
  { path: 'cart', component: ShoppingcartComponent },
  { path: 'localtraders/:lat/:lng/:rad', component: TraderOverviewComponent },
  { path: 'tradermap', component: TraderMapComponent },
  { path: 'trader-detail-redirect/:id', component: TraderDetailComponent },
  { path: 'trader-detail/:id', component: TraderDetailComponent },
  { path: 'trader/:traderId/contact', component: TraderContactComponent },
  { path: 'contacted', component: InquiryConfirmationComponent },
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ProductOverviewComponent,
    ProductItemComponent,
    ProductDetailComponent,
    ProductDetailFeedbackComponent,
    BuyConfirmationComponent,
    ShoppingcartComponent,
    TraderOverviewComponent,
    TraderItemComponent,
    TraderDetailComponent,
    TraderMapComponent,
    ShoppingcartItemComponent,
    TraderContactComponent,
    InquiryConfirmationComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule,
    ReusablesModule,
    PipesModule,
    MatCarouselModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ProductOverviewComponent, ProductItemComponent],
  providers: [ProductService],
})
export class CustomerModule {}
