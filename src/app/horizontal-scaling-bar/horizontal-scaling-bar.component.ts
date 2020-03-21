import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horizontal-scaling-bar',
  templateUrl: './horizontal-scaling-bar.component.html',
  styleUrls: ['./horizontal-scaling-bar.component.scss']
})
export class HorizontalScalingBarComponent implements OnInit {
  @Input() links: Array<Link>;
  @Output() clickedLink: EventEmitter<Link> = new EventEmitter<Link>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  clicked(link: Link) {
    if (link.getUrl()) {
      this.router.navigate([link.getUrl()]);
    }
    this.clickedLink.emit(link);
  }
}
