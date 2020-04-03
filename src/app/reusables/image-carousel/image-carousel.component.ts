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

  selectedImageUrl: string;
  showModal = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirect(url: string): void {
    this.router.navigate([url]);
  }

  getWidth() {
    return this.widthPercentage + '%';
  }

  getHeight() {
    return this.widthPercentage / this.aspectRatioWidthToHeight + 'vw';
  }

  getMaxWidth() {
    return 740 / this.aspectRatioWidthToHeight + 'px';
  }

  randomId() {
    return this.randomIdNumber;
  }

  showImageInModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.showModal = true;
  }
}
