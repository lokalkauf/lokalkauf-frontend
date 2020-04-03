import { Injectable, Component, OnInit, Input } from '@angular/core';
import { HttpCommunicationInterceptor } from '../interceptors/http-communication.interceptor';
import { Subject } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  isLoading$: Subject<boolean> = this.loading.isLoading;

  constructor(private loading: SpinnerService) {}
}
