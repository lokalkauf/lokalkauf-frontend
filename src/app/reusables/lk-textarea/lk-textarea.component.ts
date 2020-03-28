import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { fromEvent, Subject, merge } from 'rxjs';

@Component({
  selector: 'app-lk-textarea',
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
  @Input() value: string;
  disabled = false;
  formControl = new FormControl('');

  @ViewChild('textarea') set content(input: ElementRef<HTMLInputElement>) {
    merge(
      fromEvent(input.nativeElement, 'mousedown'),
      fromEvent(input.nativeElement, 'touchstart')
    ).subscribe(() => this.onTouch$.next());
  }

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
    this.disabled = isDisabled;
  }
}
