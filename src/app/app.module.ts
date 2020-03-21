import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { Routes, RouterModule } from '@angular/router';
import { TestRoutingPageComponent } from './test-routing-page/test-routing-page.component';
import { StartComponent } from './start/start.component';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProductItemComponent } from './product-item/product-item.component';
import { ImprintComponent } from './imprint/imprint.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'detail/:id', component: ProductDetailComponent },
  { path: 'test', component: TestRoutingPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HorizontalScalingBarComponent,
    TestRoutingPageComponent,
    StartComponent,
    ProductOverviewComponent,
    MapComponent,
    ProductItemComponent,
    ImprintComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    LeafletModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
