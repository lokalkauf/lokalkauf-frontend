import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MuiService {
  constructor() {}

  currentLanguage() {
    return 'de';
  }
}
