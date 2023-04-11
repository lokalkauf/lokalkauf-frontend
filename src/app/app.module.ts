import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule, Router, Scroll } from '@angular/router';
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
import { CommonModule, ViewportScroller } from '@angular/common';
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
import { CampaignComponent } from './campaign/campaign.component';
import { ImprintComponent } from './imprint/imprint.component';
import { filter } from 'rxjs/operators';
import {
  AngularFireAnalyticsModule,
  CONFIG,
  COLLECTION_ENABLED,
  DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
  APP_VERSION,
} from '@angular/fire/analytics';
import { CookieService } from 'ngx-cookie-service';

import {
  NgcCookieConsentModule,
  NgcCookieConsentConfig,
} from 'ngx-cookieconsent';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { BrowserService } from './services/browser.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { PrivacyComponent } from './privacy/privacy.component';
import { AgbComponent } from './agb/agb.component';

registerLocaleData(localeDe);

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: window.location.hostname,
  },
  palette: {
    popup: {
      background: '#fff',
    },
    button: {
      background: '#00b900',
    },
  },
  theme: 'edgeless',
  type: 'opt-in',
  content: {
    allow: 'Zulassen',
    deny: 'Ablehnen',
    link: 'Datenschutzerklärung',
    href: 'https://www.lokalkauf.org/datenschutz',
    message: `<div class="cookie-content-container"><img src="../../assets/cookie.svg"
          alt="<3 Cookies" />
          <div>Wir verwenden Cookies, um Zugriffe auf unserer Website zu analysieren. Außerdem geben wir Informationen zu
           Deiner Verwendung unserer Website an unsere Partner für Analysen weiter. Unsere Partner führen diese Informationen
            möglicherweise mit weiteren Daten zusammen, die Du ihnen bereitgestellt hast oder die sie im Rahmen Deiner Nutzung
            der Dienste gesammelt haben.
            <br />Nähere Informationen findest Du in der Datenschutzerklärung (3. und 8.5).</div></div>`,
    policy: 'Cookie Einstellungen',
  },
};

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'transport', component: TransportMainComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'agb', component: AgbComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'press', component: PressComponent },
  { path: 'campaign', component: CampaignComponent },
  {
    path: 'redirect',
    component: RedirectComponent,
    children: [{ path: '**', component: RedirectComponent }],
  },
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    AboutUsComponent,
    AgbComponent,
    ErrorDisplayComponent,
    ImprintComponent,
    PrivacyComponent,
    FeedbackComponent,
    VerifyComponent,
    SpinnerComponent,
    SpinnerComponent,
    StartComponent,
    FaqComponent,
    PressComponent,
    SearchInputComponent,
    RedirectComponent,
    CampaignComponent,
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
    FontAwesomeModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CustomerModule,
    TraderModule,
    TransportModule,
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
    }),
    ReusablesModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    HttpClientModule,
    MatPasswordStrengthModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    NgcCookieConsentModule.forRoot(cookieConfig),
    DeviceDetectorModule.forRoot(),
    AngularFireAnalyticsModule,
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
    BrowserService,
    CookieService,
    {
      provide: CONFIG,
      useValue: {
        anonymize_ip: true,
      },
    },
    { provide: COLLECTION_ENABLED, useValue: false },
    { provide: APP_VERSION, useValue: environment.version },
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events
      .pipe(filter((e: any): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.position) {
          // backward navigation
          viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          // anchor navigation
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          // forward navigation
          viewportScroller.scrollToPosition([0, 0]);
          // damn it, but it works
          document.querySelector('.mat-sidenav-content').scrollTop = 0;
        }
      });
  }
}
