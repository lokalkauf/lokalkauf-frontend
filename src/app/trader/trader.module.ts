import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { DeleteUserComponent } from './registration/delete-user/delete-user.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { LabelPipe } from '../pipes/label.pipe';
import { PipesModule } from '../pipes/pipes.modules';
import { ImageUploadComponent } from './profile/image-upload/image-upload.component';
import { OfferComponent } from './profile/offer/offer.component';

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
    CreateProductComponent,
    RegistrationComponent,
    ProfileComponent,
    LoginComponent,
    PasswordResetComponent,
    DeleteUserComponent,
    ImageUploadComponent,
    OfferComponent,
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
    MatTabsModule,
    MatDialogModule,
    ReusablesModule,
    PipesModule,
    MatPasswordStrengthModule,
  ],
})
export class TraderModule {}
