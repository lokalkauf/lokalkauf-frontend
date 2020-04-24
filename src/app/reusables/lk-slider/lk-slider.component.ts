import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'lk-slider',
  templateUrl: './lk-slider.component.html',
  styleUrls: ['./lk-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LkSliderComponent,
      multi: true,
    },
  ],
})
export class LkSliderComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() min: number;
  @Input() max: number;
  @Input() formatLabel: string;
  @Output() changingEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}
  // The internal data model
  private innerValue: any = '';

  // Placeholders for the callbacks which are later provided
  // by the Control Value Accessor
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  changing(event: any) {
    this.changingEvent.emit(event.value);
  }
}
