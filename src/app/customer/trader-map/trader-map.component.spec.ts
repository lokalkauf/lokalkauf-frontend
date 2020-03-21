import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderMapComponent } from './trader-map.component';

describe('TraderMapComponent', () => {
  let component: TraderMapComponent;
  let fixture: ComponentFixture<TraderMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
