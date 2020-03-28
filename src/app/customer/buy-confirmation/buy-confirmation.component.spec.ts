import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyConfirmationComponent } from './buy-confirmation.component';

describe('BuyConfirmationComponent', () => {
  let component: BuyConfirmationComponent;
  let fixture: ComponentFixture<BuyConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyConfirmationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
