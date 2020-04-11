import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lk-warning-box',
  templateUrl: './lk-warning-box.component.html',
  styleUrls: ['./lk-warning-box.component.scss'],
})
export class LkWarningBoxComponent implements OnInit {
  @Input() content: string;
  @Input() collapsed: boolean;
  @Input() collapseTime = 0;

  constructor() {}

  ngOnInit(): void {
    if (this.collapseTime > 0) {
      setTimeout(() => {
        this.collapsed = true;
      }, this.collapseTime);
    }
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
