import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderMainComponent } from './trader-main.component';

describe('TraderMainComponent', () => {
  let component: TraderMainComponent;
  let fixture: ComponentFixture<TraderMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
