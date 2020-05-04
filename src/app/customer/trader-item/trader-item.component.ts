import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent {
  @Input() trader: any;

  constructor() {}
}
