import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LkInputComponent } from './lk-input.component';

describe('LkInputComponent', () => {
  let component: LkInputComponent;
  let fixture: ComponentFixture<LkInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
