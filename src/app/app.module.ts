import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { Routes, RouterModule } from '@angular/router';
import { TestRoutingPageComponent } from './test-routing-page/test-routing-page.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'test', component: TestRoutingPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HorizontalScalingBarComponent,
    TestRoutingPageComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    BrowserAnimationsModule,
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
