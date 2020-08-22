import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingcartItemComponent } from './shoppingcart-item/shoppingcart-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductDetailFeedbackComponent } from './product-detail-feedback/product-detail-feedback.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TraderContactComponent } from './trader-contact/trader-contact.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { InquiryConfirmationComponent } from './inquiry-confirmation/inquiry-confirmation.component';
import { PipesModule } from '../pipes/pipes.modules';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { MatSliderModule } from '@angular/material/slider';
import { GalleryModule, GALLERY_CONFIG } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GallerizeModule } from '@ngx-gallery/gallerize';
import { BookmarksService } from '../services/bookmarks.service';
import { BookmarksOverviewComponent } from './bookmarks-overview/bookmarks-overview.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { LkMapComponent } from '../reusables/lk-map/lk-map.component';
import { BookmarksDialogComponent } from './bookmarks-dialog/bookmarks-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { BookmarksPrivateImportComponent } from './bookmarks-private-import/bookmarks-private-import.component';
// tslint:disable-next-line:max-line-length
import { BookmarksSharePrivateDialogComponent } from './bookmarks-overview/bookmarks-share-private-dialog/bookmarks-share-private-dialog.component';
// tslint:disable-next-line:max-line-length
import { BookmarksSharePublicDialogComponent } from './bookmarks-overview/bookmarks-share-public-dialog/bookmarks-share-public-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { BookmarksPublicImportComponent } from './bookmarks-public-import/bookmarks-public-import.component';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    BookmarksOverviewComponent,
    BookmarksDialogComponent,
    BookmarksPublicImportComponent,
    BookmarksPrivateImportComponent,
    BookmarksSharePrivateDialogComponent,
    BookmarksSharePublicDialogComponent,
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
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatExpansionModule,
    MatSliderModule,
    MatStepperModule,
    DragDropModule,
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
    QRCodeModule,
  ],
  exports: [ProductOverviewComponent],
  providers: [
    ProductService,
    BookmarksService,
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
