import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LkCheckboxComponent } from './lk-checkbox.component';

describe('LkCheckboxComponent', () => {
  let component: LkCheckboxComponent;
  let fixture: ComponentFixture<LkCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkCheckboxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
