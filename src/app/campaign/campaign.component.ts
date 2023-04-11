import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent implements OnInit {
  constructor() {}

  vid = '../../assets/campaign/campaign-header.mp4';
  showSample$ = of(false);

  ngOnInit(): void {}

  public showHideSample() {
    this.showSample$.subscribe((x) => (this.showSample$ = of(!x)));
  }

  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
