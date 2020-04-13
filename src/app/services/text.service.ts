import { Injectable } from '@angular/core';
import { MuiService } from './mui.service';
import { TextValue } from './uiTexts';

@Injectable()
export class TextService {
  constructor(private readonly muiService: MuiService) {}
  getText(value: TextValue) {
    if (typeof value === 'string') {
      return value;
    } else {
      return value[this.muiService.currentLanguage()];
    }
  }
}
