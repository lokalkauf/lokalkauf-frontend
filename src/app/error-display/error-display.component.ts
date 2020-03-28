import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { Error } from '../models/error';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.scss'],
})
export class ErrorDisplayComponent implements OnInit {
  currentError: Error;
  timeoutHandle: any;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.subscribe(this.setError.bind(this));

    this.setError({
      headline: 'Test',
      text: 'Hello this is a test',
    });
  }

  private setError(e: Error) {
    window.clearTimeout(this.timeoutHandle);

    this.currentError = e;

    this.timeoutHandle = window.setTimeout(this.removeError.bind(this), 4000);
  }

  private removeError() {
    this.currentError = null;
  }
}
