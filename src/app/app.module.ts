import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { ImageService } from './services/image.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReusablesModule } from './reusables/reusables.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback/feedback.component';
import { VerifyComponent } from './verify/verify.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { EMailService } from './services/email.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { FaqComponent } from './faq/faq.component';
import { StorageService } from './services/storage.service';
import { SearchInputComponent } from './start/search-input/search-input.component';
import { TextService } from './services/text.service';
import { MuiService } from './services/mui.service';
import { PipesModule } from './pipes/pipes.modules';
import { RedirectComponent } from './redirect/redirect.component';
import { PressComponent } from './press/press.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'transport', component: TransportMainComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'press', component: PressComponent },
  {
    path: 'redirect',
    component: RedirectComponent,
    children: [{ path: '**', component: RedirectComponent }],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    ErrorDisplayComponent,
    FeedbackComponent,
    VerifyComponent,
    SpinnerComponent,
    SpinnerComponent,
    StartComponent,
    FaqComponent,
    PressComponent,
    SearchInputComponent,
    RedirectComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CustomerModule,
    TraderModule,
    TransportModule,
    RouterModule.forRoot(routes, { anchorScrolling: 'enabled' }),
    ReusablesModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    HttpClientModule,
    MatPasswordStrengthModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
    }),
  ],
  exports: [RouterModule],
  providers: [
    ShoppingcartService,
    UserService,
    TraderService,
    MuiService,
    TextService,
    SpinnerService,
    StorageService,
    EMailService,
    ImageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
