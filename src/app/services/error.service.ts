import { Injectable } from '@angular/core';
import { Error } from '../models/error';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private functions = new Array<(e: Error) => void>();

  public publishByText(pHeadline: string, pText: string) {
    const e: Error = {
      headline: pHeadline,
      text: pText,
    };

    this.publish(e);
  }

  public publish(e: Error) {
    for (const func of this.functions) {
      func(e);
    }
  }

  public subscribe(func: (e: Error) => void) {
    this.functions.push(func);
  }

  public unsubscribe(func: (e: Error) => void) {
    const index = this.functions.indexOf(func);

    if (index > -1) {
      this.functions.splice(index, 1);
    }
  }
}
