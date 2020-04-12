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
import { AboutUsComponent } from './about-us/about-us.compontent';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { FaqComponent } from './faq/faq.component';
import { StorageService } from './services/storage.service';
import { SearchInputComponent } from './start/search-input/search-input.component';
import { TextService } from './services/text.service';
import { MuiService } from './services/mui.service';
import { PipesModule } from './pipes/pipes.modules';
import { RedirectComponent } from './redirect/redirect.component';
import { AngularFireAnalyticsModule, ScreenTrackingService, CONFIG, COLLECTION_ENABLED } from '@angular/fire/analytics';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'transport', component: TransportMainComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'redirect',
    component: RedirectComponent,
    children: [{ path: '**', component: RedirectComponent }],
  },
];

const cookieConfig: NgcCookieConsentConfig = {
  'cookie': {
    'domain': 'tinesoft.github.io'
  },
  'position': 'bottom',
  'theme': 'edgeless',
  'palette': {
    'popup': {
      'background': '#000000',
      'text': '#ffffff',
      'link': '#ffffff'
    },
    'button': {
      'background': '#55b435',
      'text': '#000000',
      'border': 'transparent'
    }
  },
  'type': 'opt-in',
  'content': {
    'message': 'Erlaubst du uns Cookies zu nutzen, um lokalkauf zu verbessern?',
    'allow': 'Ja, gerne!',
    'deny': 'Nein, danke!',
    'link': 'Datenschutzrichtilinie ansehen',
    'href': 'https://www.info.lokalkauf.org/datenschutz',
    'policy': 'Cookie Policy'
  }
}
;

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
    AngularFireAnalyticsModule,
    NgcCookieConsentModule.forRoot(cookieConfig)
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
    ScreenTrackingService,
    { provide: COLLECTION_ENABLED, useFactory: () => false },
    { provide: CONFIG, useValue: {
        send_page_view: true,
        allow_ad_personalization_signals: false,
        anonymize_ip: true}
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
