import { NgModule } from '@angular/core';
import { LabelPipe } from './label.pipe';
import { SafePipe } from './safe.pipe';
import { Nl2BrPipeModule } from 'nl2br-pipe';

@NgModule({
  imports: [Nl2BrPipeModule],
  declarations: [LabelPipe, SafePipe],
  exports: [LabelPipe, SafePipe],
})
export class PipesModule {}
