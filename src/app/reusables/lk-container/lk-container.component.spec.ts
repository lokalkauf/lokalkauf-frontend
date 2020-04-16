import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LkContainerComponent } from './lk-container.component';

describe('LkContainerComponent', () => {
  let component: LkContainerComponent;
  let fixture: ComponentFixture<LkContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
