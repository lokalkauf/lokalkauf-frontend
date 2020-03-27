import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryConfirmationComponent } from './inquiry-confirmation.component';

describe('InquiryConfirmationComponent', () => {
  let component: InquiryConfirmationComponent;
  let fixture: ComponentFixture<InquiryConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InquiryConfirmationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
