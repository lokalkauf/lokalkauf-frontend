import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lk-warning-box',
  templateUrl: './lk-warning-box.component.html',
  styleUrls: ['./lk-warning-box.component.scss'],
})
export class LkWarningBoxComponent implements OnInit {
  @Input() content: string;

  constructor() {}

  ngOnInit(): void {}
}
