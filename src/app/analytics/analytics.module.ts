import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';

export const routes: Routes = [{ path: '', component: AnalyticsComponent }];

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AngularFireAnalyticsModule,
  ],
  exports: [AnalyticsComponent],
})
export class AnalyticsModule {}
