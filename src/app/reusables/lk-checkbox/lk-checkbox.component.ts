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
  onClick$: Subject<boolean>;

  checked$ = new BehaviorSubject(false);

  constructor() {
    this.onClick$ = new Subject();
    this.onClick$.subscribe(() => {
      this.checked$.next(!this.checked$.value);
    });
  }

  writeValue(value: boolean): void {
    this.checked$.next(value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.checked$.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouch$.subscribe(fn);
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
