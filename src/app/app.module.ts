import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { CustomerModule } from './customer/customer.module';
import { TraderModule } from './trader/trader.module';
import { TransportModule } from './transport/transport.module';

import { StartComponent } from './start/start.component';
import { ImprintComponent } from './imprint/imprint.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { HorizontalScalingBarComponent } from './reusables/horizontal-scaling-bar/horizontal-scaling-bar.component';
import { MapComponent } from './reusables/map/map.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'imprint', component: ImprintComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ImprintComponent,
    RegistrationComponent,
    LoginComponent,
    HorizontalScalingBarComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    CustomerModule,
    TraderModule,
    TransportModule,
    LeafletModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
