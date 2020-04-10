import { NgModule } from '@angular/core';
import { LabelPipe } from './label.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [LabelPipe, SafePipe],
  exports: [LabelPipe, SafePipe],
})
export class PipesModule {}
