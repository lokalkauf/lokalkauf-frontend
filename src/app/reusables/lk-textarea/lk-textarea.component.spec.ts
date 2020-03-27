import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LkTextareaComponent } from './lk-textarea.component';

describe('LkButtonComponent', () => {
  let component: LkTextareaComponent;
  let fixture: ComponentFixture<LkTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LkTextareaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LkTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
