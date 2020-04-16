import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lk-page-title',
  templateUrl: './lk-page-title.component.html',
  styleUrls: ['./lk-page-title.component.scss'],
})
export class LkPageTitleComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;

  constructor() {}

  ngOnInit(): void {}
}
