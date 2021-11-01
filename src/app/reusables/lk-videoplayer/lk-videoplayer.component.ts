import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowserService } from 'src/app/services/browser.service';

export interface LkVideo {
  small: string;
  big: string;
  preview?: string;
}

@Component({
  selector: 'lk-videoplayer',
  templateUrl: './lk-videoplayer.component.html',
  styleUrls: ['./lk-videoplayer.component.scss'],
})
export class LkVideoplayerComponent implements OnInit {
  @Input()
  videoList: Observable<LkVideo[]>;

  isMobile: boolean;

  constructor(private readonly browserService: BrowserService) {
    this.isMobile = browserService.isMobile();
  }

  ngOnInit(): void {}
}
