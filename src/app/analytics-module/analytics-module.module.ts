import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AnalyticsModuleRoutingModule } from './analytics-module-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AnalyticsModuleRoutingModule,
    AngularFireAnalyticsModule,
  ],
})
export class AnalyticsModuleModule {}
