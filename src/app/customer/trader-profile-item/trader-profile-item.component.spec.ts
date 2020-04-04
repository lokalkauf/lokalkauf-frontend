import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderProfileItemComponent } from './trader-profile-item.component';

describe('TraderProfileItemComponent', () => {
  let component: TraderProfileItemComponent;
  let fixture: ComponentFixture<TraderProfileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TraderProfileItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderProfileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
