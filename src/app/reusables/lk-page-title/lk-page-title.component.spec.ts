import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LkPageTitleComponent } from './lk-page-title.component';

describe('LkPageTitleComponent', () => {
  let component: LkPageTitleComponent;
  let fixture: ComponentFixture<LkPageTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkPageTitleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
