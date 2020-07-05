import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { LkSelectOptions } from '../lk-select/lk-select.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lk-chip-list',
  templateUrl: './lk-chip-list.component.html',
  styleUrls: ['./lk-chip-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LkChipListComponent,
      multi: true,
    },
  ],
})
export class LkChipListComponent implements OnInit {
  @Input() items: Observable<LkSelectOptions[]>;
  @Input() selectedKey: string;
  @Input() removable: boolean;
  selectable1 = false;
  @Output()
  lkChipListChange: EventEmitter<LkSelectOptions> = new EventEmitter<
    LkSelectOptions
  >();

  @Output()
  lkChipRemove: EventEmitter<LkSelectOptions> = new EventEmitter<
    LkSelectOptions
  >();

  private innerValue: any = '';

  constructor() {}

  ngOnInit(): void {}

  select(option: LkSelectOptions) {
    this.selectedKey = option.key;
    this.lkChipListChange.emit(option);
  }

  remove(option: LkSelectOptions): void {
    if (option && this.removable) {
      this.lkChipRemove.emit(option);
    }
  }
}
