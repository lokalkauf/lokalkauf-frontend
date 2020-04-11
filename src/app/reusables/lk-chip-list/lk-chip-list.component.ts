import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LkSelectOptions } from '../lk-select/lk-select.component';

@Component({
  selector: 'lk-chip-list',
  templateUrl: './lk-chip-list.component.html',
  styleUrls: ['./lk-chip-list.component.scss'],
})
export class LkChipListComponent implements OnInit {
  @Input() items: Observable<LkSelectOptions[]>;
  @Input() selectedKey: string;

  constructor() {}

  ngOnInit(): void {}

  select(key: string) {
    this.selectedKey = key;
  }
}
