import { Component, Input, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';

export interface Testimonial {
  img: string;
  text: string;
  name: string;
  traderid: string;
}

export interface TestimonialConfig {
  speed: number;
}

@Component({
  selector: 'lk-testimonial',
  templateUrl: './lk-testimonial.component.html',
  styleUrls: ['./lk-testimonial.component.scss'],
})
export class LkTestimonialComponent implements OnInit {
  @Input()
  testimonialList: Observable<Testimonial[]>;

  @Input()
  config: TestimonialConfig = { speed: 5000 };

  currentElementIndex = -1;
  lstSync: Testimonial[];
  ngOnInit() {
    this.testimonialList.subscribe((testis) => {
      this.lstSync = testis;
      const lsLength = testis.length - 1;

      this.runCarousel(this.lstSync, lsLength);
      interval(this.config.speed).subscribe((x) => {
        this.runCarousel(this.lstSync, lsLength);
      });
    });
  }

  private runCarousel(testis: Testimonial[], lsLength: number) {
    console.log(this.currentElementIndex, lsLength);
    if (this.currentElementIndex === lsLength) {
      this.currentElementIndex = 0;
    } else {
      this.currentElementIndex++;
    }
  }
}
