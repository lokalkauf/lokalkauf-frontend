import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderOverviewComponent } from './trader-overview.component';

describe('TraderOverviewComponent', () => {
  let component: TraderOverviewComponent;
  let fixture: ComponentFixture<TraderOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
