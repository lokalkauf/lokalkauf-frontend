import { Component, OnInit, Input } from '@angular/core';
import { TextService } from 'src/app/services/text.service';
import { TextKey, uiTexts, TextValue } from 'src/app/services/uiTexts';
import { Observable } from 'rxjs';

export interface LicenceTexts {
  generalText: TextValue;
  urlText: TextValue;
  url: TextValue;
}

@Component({
  selector: 'lk-attribution',
  templateUrl: './lk-attribution.component.html',
  styleUrls: ['./lk-attribution.component.scss'],
})
export class LkAttributionComponent implements OnInit {
  @Input() licence: string;

  public licenceOutput: LicenceTexts;
  constructor(private readonly textservice: TextService) {}

  ngOnInit(): void {
    this.licenceOutput = this.getTextKeys(this.licence);
  }

  private getTextKeys(licence: string): LicenceTexts {
    if (!licence) {
      return undefined;
    }

    switch (licence.toLocaleLowerCase()) {
      case 'odbl':
        return {
          generalText: uiTexts.licence_odbl_general_text,
          url: uiTexts.licence_odbl_url,
          urlText: uiTexts.licence_odbl_url_text,
        };
      default:
        return undefined;
    }
  }
}
