import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LkInputComponent } from './lk-input/lk-input.component';
import { LkButtonComponent } from './lk-button/lk-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LkTextareaComponent } from './lk-textarea/lk-textarea.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LkPageTitleComponent } from './lk-page-title/lk-page-title.component';
import { LkCheckboxComponent } from './lk-checkbox/lk-checkbox.component';
import { ImageChooserComponent } from './image-chooser/image-chooser.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    MapComponent,
    HorizontalScalingBarComponent,
    LkInputComponent,
    LkButtonComponent,
    LkTextareaComponent,
    ImageCarouselComponent,
    LkPageTitleComponent,
    LkCheckboxComponent,
    ImageChooserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule.forRoot(),
    RouterModule.forRoot(routes),
    MatIconModule,
  ],
  exports: [
    MapComponent,
    HorizontalScalingBarComponent,
    LkInputComponent,
    LkButtonComponent,
    LkTextareaComponent,
    LkPageTitleComponent,
    LkCheckboxComponent,
    ImageChooserComponent,
    ImageCarouselComponent,
  ],
})
export class ReusablesModule {}
