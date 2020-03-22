import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFldComponent } from './input-fld.component';

describe('InputFldComponent', () => {
  let component: InputFldComponent;
  let fixture: ComponentFixture<InputFldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
