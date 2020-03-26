import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { TraderMainComponent } from './trader-main/trader-main.component';
import { ReusablesModule } from '../reusables/reusables.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'trader/profile', component: ProfileComponent },
  { path: 'trader/registration', component: RegistrationFormComponent },
];

@NgModule({
  declarations: [
    OrdersComponent,
    CreateProductComponent,
    TraderMainComponent,
    RegistrationFormComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReusablesModule,
  ],
})
export class TraderModule {}
