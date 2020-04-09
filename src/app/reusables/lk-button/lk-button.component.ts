import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lk-button',
  templateUrl: './lk-button.component.html',
  styleUrls: ['./lk-button.component.scss'],
})
export class LkButtonComponent implements OnInit {
  @Input() label: string;
  @Input() disabled = false;
  @Input() type = 'button';
  @Input() minSizePercent: number;
  @Input() warn = false;
  @Input() color = 'primary';
  constructor() {}

  ngOnInit(): void {}
}
