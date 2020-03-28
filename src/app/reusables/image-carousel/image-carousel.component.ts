import { Component, OnInit, Input } from '@angular/core';
import { CarouselEntry } from 'src/app/models/carouselEntry';
import { Router } from '@angular/router';
import { Link } from 'src/app/models/link';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss'],
})
export class ImageCarouselComponent implements OnInit {
  @Input() carouselSlides: Array<CarouselEntry> = new Array<CarouselEntry>();
  @Input() widthPercentage = 80;
  @Input() aspectRatioWidthToHeight = 1.6;

  private randomIdNumber =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // For demo purposes only. This shows how to use the slider
    // const carouselEntry = new CarouselEntry('/assets/start-image.png');
    // carouselEntry.setLink(new Link('go to start page', '/', true));
    // this.carouselSlides.push(carouselEntry);
    // this.carouselSlides.push(new CarouselEntry('/assets/start-image.png', 'Test description'));
  }

  redirect(url: string): void {
    this.router.navigate([url]);
  }

  getWidth() {
    return this.widthPercentage + 'vw';
  }

  getHeight() {
    return this.widthPercentage / this.aspectRatioWidthToHeight + 'vw';
  }

  randomId() {
    return this.randomIdNumber;
  }
}
