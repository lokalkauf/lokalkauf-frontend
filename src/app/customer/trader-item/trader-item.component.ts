import { Component, OnInit, Input } from '@angular/core';
import { Trader } from '../../models/trader';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss']
})
export class TraderItemComponent implements OnInit {

  @Input() trader: Trader;

  constructor() { }

  ngOnInit(): void {}

}
