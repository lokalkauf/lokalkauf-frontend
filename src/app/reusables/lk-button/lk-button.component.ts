import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lk-button',
  templateUrl: './lk-button.component.html',
  styleUrls: ['./lk-button.component.scss'],
})
export class LkButtonComponent implements OnInit {
  @Input() label: string;
  @Input() disabled = false;
  @Input() type: string;
  @Input() minSizePercent: number;
  @Input() warn = false;
  constructor() {}

  ngOnInit(): void {}
}
