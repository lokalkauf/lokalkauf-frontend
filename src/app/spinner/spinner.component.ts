import { Component } from '@angular/core';
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
