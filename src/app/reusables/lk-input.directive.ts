import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appLkInput]'
})
export class LkInputDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style['box-sizing'] = 'border-box';
    el.nativeElement.style.width = '100%';
    el.nativeElement.style.height = '40px';
    el.nativeElement.style['font-size'] = '1rem';
    el.nativeElement.style.margin = '10px 0';
    el.nativeElement.style['border-radius'] = '20px';
    el.nativeElement.style.padding = '0 10px';
    el.nativeElement.style['-webkit-appearance'] = 'none;';
    el.nativeElement.style['-moz-appearance'] = 'none';
    el.nativeElement.style.border = '1px solid grey';
  }
}
