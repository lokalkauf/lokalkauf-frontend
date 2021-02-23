import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lk-checkbox',
  templateUrl: './lk-checkbox.component.html',
  styleUrls: ['./lk-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LkCheckboxComponent,
      multi: true,
    },
  ],
})
export class LkCheckboxComponent implements ControlValueAccessor {
  @Input() type: string;
  @Input() warn = false;
  @Input() name: string;
  disabled = false;

  onTouch$ = new Subject();
  onChange$ = new Subject();

  checked = false;

  private onTouchedCallback: () => void = () => {};

  constructor() {}

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur() {
    this.onTouchedCallback();
  }

  onInputChange(event: Event) {
    event.stopPropagation();
  }

  onInputClick(event: Event) {
    event.stopPropagation();
    this.onBlur();

    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange$.next(this.checked);
    }
  }
}
