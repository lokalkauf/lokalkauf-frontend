import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { InputFldComponent } from './input-fld/input-fld.component';



@NgModule({
  declarations: [
    MapComponent,
    HorizontalScalingBarComponent,
    InputFldComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [
    MapComponent,
    HorizontalScalingBarComponent,
    InputFldComponent
  ]
})
export class ReusablesModule { }
