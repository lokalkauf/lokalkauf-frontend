import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingStarComponent } from './rating-star.component';

describe('RatingStarComponent', () => {
  let component: RatingStarComponent;
  let fixture: ComponentFixture<RatingStarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingStarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
