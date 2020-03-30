import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { CustomerModule } from './customer/customer.module';
import { TraderModule } from './trader/trader.module';
import { TransportModule } from './transport/transport.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { StartComponent } from './start/start.component';
import { TransportMainComponent } from './transport/transport-main/transport-main.compontent';
import { ShoppingcartService } from './services/shoppingcart.service';
import { UserService } from './services/user.service';
import { TraderService } from './services/trader.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReusablesModule } from './reusables/reusables.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback/feedback.component';
import { VerifyComponent } from './verify/verify.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CommonModule } from '@angular/common';
import { EMailService } from './services/email.service';
import { SafePipe } from './pipes/safe.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { HttpCommunicationInterceptor } from './interceptors/http-communication.interceptor';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { AboutUsComponent } from './about-us/about-us.compontent';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'transport', component: TransportMainComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'aboutus', component: AboutUsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    ErrorDisplayComponent,
    FeedbackComponent,
    VerifyComponent,
    SpinnerComponent,
    SafePipe,
    SpinnerComponent,
    StartComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CustomerModule,
    TraderModule,
    TransportModule,
    RouterModule.forRoot(routes),
    ReusablesModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  exports: [RouterModule],
  providers: [
    ShoppingcartService,
    UserService,
    TraderService,
    SpinnerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCommunicationInterceptor,
      multi: true,
    },
    EMailService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
