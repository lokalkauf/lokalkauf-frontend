import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeTransportComponent } from './take-transport.component';

describe('TakeTransportComponent', () => {
  let component: TakeTransportComponent;
  let fixture: ComponentFixture<TakeTransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TakeTransportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
