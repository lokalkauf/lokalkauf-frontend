import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input-fld',
  templateUrl: './input-fld.component.html',
  styleUrls: ['./input-fld.component.scss']
})
export class InputFldComponent implements OnInit {

  @Input() value: string;

  constructor() { }

  ngOnInit(): void {
  }

}
