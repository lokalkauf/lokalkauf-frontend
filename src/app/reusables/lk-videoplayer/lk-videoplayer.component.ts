import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

export interface LkVideo {
  small: string;
  big: string;
}

@Component({
  selector: 'lk-videoplayer',
  templateUrl: './lk-videoplayer.component.html',
  styleUrls: ['./lk-videoplayer.component.scss'],
})
export class LkVideoplayerComponent implements OnInit {
  @Input()
  videoList: Observable<LkVideo[]>;

  ngOnInit(): void {}
}
