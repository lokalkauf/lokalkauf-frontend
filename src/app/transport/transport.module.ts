import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportOffersComponent } from './transport-offers/transport-offers.component';
import { TransportDetailComponent } from './transport-detail/transport-detail.component';
import { TransportItemComponent } from './transport-item/transport-item.component';
import { TakeTransportComponent } from './take-transport/take-transport.component';
import { TransportMainComponent } from './transport-main/transport-main.compontent';
import { PipesModule } from '../pipes/pipes.modules';

@NgModule({
  declarations: [
    TransportOffersComponent,
    TransportDetailComponent,
    TransportItemComponent,
    TakeTransportComponent,
    TransportMainComponent,
  ],
  imports: [CommonModule, PipesModule],
})
export class TransportModule {}
