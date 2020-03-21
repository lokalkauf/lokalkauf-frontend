import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Link } from '../../models/link';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-horizontal-scaling-bar',
  templateUrl: './horizontal-scaling-bar.component.html',
  styleUrls: ['./horizontal-scaling-bar.component.scss']
})
export class HorizontalScalingBarComponent implements OnInit {
  @Input() links: Array<Link>;
  @Output() clickedLink: EventEmitter<Link> = new EventEmitter<Link>();

  constructor(private router: Router, private myElement: ElementRef) { }

  ngOnInit(): void {

    this.router.events
               .subscribe(x => this.activateAndScrollIntoView());

    this.activateAndScrollIntoView();
  }

  activateAndScrollIntoView() {
    this.links.forEach(x => x.activated = x.getUrl() === this.router.url);
    this.scrollIntoView();
  }

  scrollIntoView() {
    window.setTimeout(_ => {
      const el = document.getElementsByClassName('activeLink');
      if (el.length > 0) {
        el[0].scrollIntoView();
      }
    }, 50);
  }

  clicked(link: Link) {
    this.links.forEach(x => x.activated = false);
    link.activated = true;
    if (link.getUrl()) {
      this.router.navigate([link.getUrl()]);
    }
    this.scrollIntoView();
    this.clickedLink.emit(link);
  }
}
