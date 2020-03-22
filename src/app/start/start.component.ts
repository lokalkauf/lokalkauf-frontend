import { Component, OnInit } from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';

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

  action(){
    this.router.navigate([ '/localtraders' ])
 }
}
