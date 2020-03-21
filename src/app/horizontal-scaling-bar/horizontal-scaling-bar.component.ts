import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ElementRef } from '@angular/core'; // at the top of component.ts

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
    // tslint:disable-next-line: max-line-length
    this.activateAndScrollIntoView();

    this.router.events
               .subscribe(x => this.activateAndScrollIntoView());
  }

  activateAndScrollIntoView()
  {
    this.links.forEach(x => x.activated = x.getUrl() === this.router.url.replace('^/', ''));

    let el = this.myElement.nativeElement.querySelector('.active');
    //el.scrollIntoView();
  }

  clicked(link: Link) {
    this.links.forEach(x => x.activated = false);
    link.activated = true;

    if (link.getUrl()) {
      this.router.navigate([link.getUrl()]);
    }
    this.clickedLink.emit(link);
  }
}
