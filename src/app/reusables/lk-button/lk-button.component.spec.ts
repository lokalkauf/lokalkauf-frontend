import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LkButtonComponent } from './lk-button.component';

describe('LkButtonComponent', () => {
  let component: LkButtonComponent;
  let fixture: ComponentFixture<LkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
