import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, Subject, merge } from 'rxjs';

@Component({
  selector: 'lk-textarea',
  templateUrl: './lk-textarea.component.html',
  styleUrls: ['./lk-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LkTextareaComponent,
      multi: true,
    },
  ],
})
export class LkTextareaComponent implements ControlValueAccessor {
  @Input() placeholder: string;
  @Input() maxLength = 32767;

  constructor() {}

  // The internal data model
  private innerValue: any = '';
  public lenChangedText: string;

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
      this.updateMaxLenText();
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  private updateMaxLenText() {
    if (this.maxLength && this.maxLength !== 32767) {
      const len = this.innerValue.toString().length;
      this.lenChangedText = `(${len} / ${this.maxLength})`;
    }
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
}
