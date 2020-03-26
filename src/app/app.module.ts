import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { CustomerModule } from './customer/customer.module';
import { TraderModule } from './trader/trader.module';
import { TransportModule } from './transport/transport.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { StartComponent } from './start/start.component';
import { ImprintComponent } from './imprint/imprint.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ReusablesModule } from './reusables/reusables.module';
import { TransportMainComponent } from './transport/transport-main/transport-main.compontent';
import { TraderMainComponent } from './trader/trader-main/trader-main.component';
import { ShoppingcartService } from './services/shoppingcart.service';
import { UserService } from './services/user.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';

import { CommonModule } from '@angular/common';
import { EMailService } from "./services/email.service";
import { HttpClientModule } from "@angular/common/http";


const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'transport', component: TransportMainComponent },
  { path: 'verkaeufer', component: TraderMainComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ImprintComponent,
    RegistrationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatCardModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    CustomerModule,
    TraderModule,
    TransportModule,
    RouterModule.forRoot(routes),
    ReusablesModule,
    FormsModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [ShoppingcartService, UserService, EMailService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
