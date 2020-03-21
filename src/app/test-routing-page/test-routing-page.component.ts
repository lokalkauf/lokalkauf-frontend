import { Component, OnInit } from '@angular/core';
import { Link } from '../models/link';

@Component({
  selector: 'app-test-routing-page',
  templateUrl: './test-routing-page.component.html',
  styleUrls: ['./test-routing-page.component.scss']
})
export class TestRoutingPageComponent implements OnInit {
  links = [
    new Link('Bäcker', '/', true),
    new Link('Fashion ', '#fashion', false),
    new Link('Metzger', '#fleisch', false),
    new Link('Kiosk', '#bier', false),
    new Link('Weiteres', '/test', true),
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
