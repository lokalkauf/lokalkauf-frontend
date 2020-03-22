import { Component, OnInit, Input } from '@angular/core';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-input-fld',
  templateUrl: './input-fld.component.html',
  styleUrls: ['./input-fld.component.scss']
})
export class InputFldComponent implements OnInit {

  @Input() value:string;
  @Input() placeholder:string;

  constructor() { }

  ngOnInit(): void {
  }

}
