import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderItemComponent } from './trader-item.component';

describe('TraderItemComponent', () => {
  let component: TraderItemComponent;
  let fixture: ComponentFixture<TraderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
