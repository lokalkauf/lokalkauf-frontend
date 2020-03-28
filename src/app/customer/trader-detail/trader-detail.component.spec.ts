import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderDetailComponent } from './trader-detail.component';

describe('TraderDetailComponent', () => {
  let component: TraderDetailComponent;
  let fixture: ComponentFixture<TraderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TraderDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
