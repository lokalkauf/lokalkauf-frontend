import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LkProductItemComponent } from './lk-product-item.component';

describe('LkProductItemComponent', () => {
  let component: LkProductItemComponent;
  let fixture: ComponentFixture<LkProductItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkProductItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
