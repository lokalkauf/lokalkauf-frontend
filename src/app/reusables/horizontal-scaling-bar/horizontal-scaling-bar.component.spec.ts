import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalScalingBarComponent } from './horizontal-scaling-bar.component';

describe('HorizontalScalingBarComponent', () => {
  let component: HorizontalScalingBarComponent;
  let fixture: ComponentFixture<HorizontalScalingBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalScalingBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalScalingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
