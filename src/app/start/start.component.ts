import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { isNumber } from 'util';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  links = [
    new Link('Bäcker', '/', true),
    new Link('Fashion ', '#fashion', false),
    new Link('Metzger', '#fleisch', false),
    new Link('Kiosk', '#bier', false),
    new Link('Weiteres', '/test', true),
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  consoleLog(event: any) {
    console.log(event);
  }

  action(plz: string) {
    if (this.isValidPlz(plz)) {
      this.router.navigate([ '/localtraders/' + plz ]);
    }
 }

 isValidPlz(plz: string): boolean {
  return (!isNaN(Number(plz)) && Number(plz).toString().length === 5);
 }

}
