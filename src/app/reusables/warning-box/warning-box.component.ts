import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-warning-box',
  templateUrl: './warning-box.component.html',
  styleUrls: ['./warning-box.component.scss'],
})
export class WarningBoxComponent implements OnInit {
  @Input() content: string;

  constructor() {}

  ngOnInit(): void {}
}
