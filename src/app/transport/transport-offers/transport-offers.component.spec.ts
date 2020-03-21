import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportOffersComponent } from './transport-offers.component';

describe('TransportOffersComponent', () => {
  let component: TransportOffersComponent;
  let fixture: ComponentFixture<TransportOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
