import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { LkInputComponent } from '../lk-input/lk-input.component';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

export interface LkSelectOptions {
  key: string;
  value: any;
  display: string;
}

@Component({
  selector: 'app-lk-select',
  templateUrl: './lk-select.component.html',
  styleUrls: ['./lk-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LkSelectComponent),
      multi: true,
    },
  ],
})
export class LkSelectComponent
  implements ControlValueAccessor, OnChanges, OnInit {
  @Input() placeholder: Observable<string>;
  @Input() name: string;
  @Input() options: Observable<LkSelectOptions[]>;
  @Input() intValue = '';
  @Output() ngModelChange = new EventEmitter();

  optionsAsValue: LkSelectOptions[];

  public touched = false;

  ngOnInit() {
    this.internalValue = 'TEST';
    this.intValue = 'TEST';
    console.log(this.internalValue);

    this.ngModelChange.emit(this.internalValue);
  }

  public comparer(c1: any, c2: any) {
    console.log(c1, ' <> ', c2);
    return c1 && c2 ? c1.lng === c2.lng && c1.lat === c2.lat : c1 === c2;
  }

  public onChange: any = (_) => {
    /*Empty*/
  };
  public onTouched: any = () => {
    /*Empty*/
  };

  get internalValue() {
    return this.intValue;
  }

  set internalValue(val: any) {
    if (val === undefined || val === null || val === '') {
      this.intValue = '';
      this.onChange(undefined);
      return;
    }

    this.intValue = val;
    this.onChange(this.intValue);
  }

  //////////////////////////////////
  // OnChanges interface
  //////////////////////////////////

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && this.options) {
      this.options.subscribe((val) => (this.optionsAsValue = val));
    }
  }

  //////////////////////////////////
  // ControlValueAccessor interface
  //////////////////////////////////

  writeValue(value: any) {
    if (value === undefined || value === null) {
      this.internalValue = '';
      return;
    }

    this.internalValue = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    const self = this;
    this.onTouched = (arg: any) => {
      self.touched = true;
      fn(arg);
    };
  }
}
