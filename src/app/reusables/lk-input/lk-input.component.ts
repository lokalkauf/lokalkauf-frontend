import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
} from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lk-input',
  templateUrl: './lk-input.component.html',
  styleUrls: ['./lk-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LkInputComponent,
      multi: true,
    },
  ],
})
export class LkInputComponent implements ControlValueAccessor {
  @Input() type: string;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() warn = false;
  @Input() name: string;

  // tslint:disable-next-line: no-input-rename
  @Input('ngModel') inputModel: string;
  // tslint:disable-next-line: no-output-rename
  @Output('ngModelChange') inputModelChange = new EventEmitter<string>();

  formControl = new FormControl('');

  onTouch$ = new Subject();

  constructor() {}

  writeValue(value: string): void {
    this.formControl.setValue(value);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.formControl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouch$.subscribe(fn);
  }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}
