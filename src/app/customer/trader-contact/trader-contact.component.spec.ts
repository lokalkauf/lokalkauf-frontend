import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderContactComponent } from './trader-contact.component';

describe('TraderEmailComponent', () => {
  let component: TraderContactComponent;
  let fixture: ComponentFixture<TraderContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
