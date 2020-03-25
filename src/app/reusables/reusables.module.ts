import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LkInputDirective } from './lk-input.directive';



@NgModule({
  declarations: [
    MapComponent,
    HorizontalScalingBarComponent,
    LkInputDirective
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [
    MapComponent,
    HorizontalScalingBarComponent,
    LkInputDirective
  ]
})
export class ReusablesModule { }
