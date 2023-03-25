import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { DeleteUserComponent } from './registration/delete-user/delete-user.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { PipesModule } from '../pipes/pipes.modules';
import { ImageUploadComponent } from './profile/image-upload/image-upload.component';
import { OfferComponent } from './profile/offer/offer.component';
import { ProductsComponent } from './profile/products/products.component';
import { CreateProductComponent } from './profile/products/create-product/create-product.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { OnlineShopComponent } from './profile/online-shop/online-shop.component';

const routes: Routes = [
  { path: 'trader/profile', component: ProfileComponent },
  { path: 'trader/register/new', component: RegistrationComponent },
  { path: 'trader/register/edit', component: RegistrationComponent },
  { path: 'trader/login', component: LoginComponent },
  { path: 'trader/password-reset', component: PasswordResetComponent },
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    OrdersComponent,
    ProductsComponent,
    OnlineShopComponent,
    RegistrationComponent,
    ProfileComponent,
    LoginComponent,
    PasswordResetComponent,
    DeleteUserComponent,
    ImageUploadComponent,
    OfferComponent,
    CreateProductComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' }),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    MatCardModule,
    ReusablesModule,
    PipesModule,
    MatPasswordStrengthModule,
    MatSnackBarModule,
  ],
})
export class TraderModule {}
