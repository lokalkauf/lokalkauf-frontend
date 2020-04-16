import { Pipe, PipeTransform } from '@angular/core';
import { TextService } from '../services/text.service';
import { TextValue } from '../services/uiTexts';

@Pipe({
  name: 'text',
})
export class LabelPipe implements PipeTransform {
  constructor(private readonly textService: TextService) {}

  public transform(key: TextValue): string {
    return this.textService.getText(key);
  }
}
