import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Event } from '@angular/router';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class RatingStarComponent implements OnInit {
  @Input() disabled = false;
  @Input() initialRating = 1;

  @Output() finalRating: EventEmitter<number> = new EventEmitter<number>();

  ratingStar: number;

  constructor() {}

  ngOnInit() {
    this.ratingStar = this.initialRating;
    this.changeRate(this.ratingStar);
  }

  changeRate(event: any) {
    this.finalRating.emit(this.ratingStar);
  }
}
