import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HorizontalScalingBarComponent } from './horizontal-scaling-bar/horizontal-scaling-bar.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LkInputComponent } from './lk-input/lk-input.component';
import { LkButtonComponent } from './lk-button/lk-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LkTextareaComponent } from './lk-textarea/lk-textarea.component';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LkPageTitleComponent } from './lk-page-title/lk-page-title.component';
import { LkCheckboxComponent } from './lk-checkbox/lk-checkbox.component';
import { ImageChooserComponent } from './image-chooser/image-chooser.component';
import { FullscreenModalComponent } from './fullscreen-modal/fullscreen-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LkSelectComponent } from './lk-select/lk-select.component';
import { WarningBoxComponent } from './warning-box/warning-box.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { RatingStarComponent } from './rating-star/rating-star.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    MapComponent,
    HorizontalScalingBarComponent,
    LkInputComponent,
    LkButtonComponent,
    LkTextareaComponent,
    LkPageTitleComponent,
    LkCheckboxComponent,
    LkSelectComponent,
    ImageChooserComponent,
    FullscreenModalComponent,
    WarningBoxComponent,
    RatingStarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule.forRoot(),
    RouterModule.forRoot(routes),
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    NgxStarRatingModule,
  ],
  exports: [
    MapComponent,
    HorizontalScalingBarComponent,
    LkInputComponent,
    LkButtonComponent,
    LkTextareaComponent,
    LkPageTitleComponent,
    LkCheckboxComponent,
    LkSelectComponent,
    ImageChooserComponent,
    FullscreenModalComponent,
    WarningBoxComponent,
    RatingStarComponent,
  ],
})
export class ReusablesModule {}
