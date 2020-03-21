import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';



@NgModule({
  declarations: [
    MapComponent,
    HorizontalScalingBarComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [
  ]
})
export class ReusablesModule { }
