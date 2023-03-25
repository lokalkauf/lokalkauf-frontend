import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { RouterModule, Routes } from '@angular/router';
import { BuyConfirmationComponent } from './buy-confirmation/buy-confirmation.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { TraderOverviewComponent } from './trader-overview/trader-overview.component';
import { TraderItemComponent } from './trader-item/trader-item.component';
import { TraderDetailComponent } from './trader-detail/trader-detail.component';
import { TraderMapComponent } from './trader-map/trader-map.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingcartItemComponent } from './shoppingcart-item/shoppingcart-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductDetailFeedbackComponent } from './product-detail-feedback/product-detail-feedback.component';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { TraderContactComponent } from './trader-contact/trader-contact.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { InquiryConfirmationComponent } from './inquiry-confirmation/inquiry-confirmation.component';
import { PipesModule } from '../pipes/pipes.modules';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { GalleryModule, GALLERY_CONFIG } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GallerizeModule } from '@ngx-gallery/gallerize';

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
    MatSliderModule,
    FontAwesomeModule,
    ReusablesModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    Nl2BrPipeModule,
    GalleryModule,
    LightboxModule.withConfig({
      backdropClass: 'gallery-lightbox',
    }),
    GallerizeModule,
  ],
  exports: [ProductOverviewComponent],
  providers: [
    ProductService,
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: false,
        imageSize: 'contain',
        counter: false,
        thumb: false,
      },
    },
  ],
})
export class CustomerModule {}

// for fullscreen of lightbox on any device use in config: panelClass: 'fullscreen',
