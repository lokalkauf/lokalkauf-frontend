import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trader-item',
  template: `
      <a [routerLink]="'/trader-detail/' + id">
        <mat-card class="trader-item">
          <div class="image-wrapper" mat-card-image [ngStyle]="{'background-image': 'url(' + imageUrl + ')'}">
          </div>
          <mat-card-content>
            <p class="title">{{ name }}</p>
          </mat-card-content>
        </mat-card>
      </a>
  `,
  styleUrls: ['./trader-item.component.scss']
})
export class TraderItemComponent implements OnInit {

  @Input() id: string;
  @Input() name: string;
  @Input() imageUrl: string;

  constructor() { }

  ngOnInit(): void {}

}
