import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRoutingPageComponent } from './test-routing-page.component';

describe('TestRoutingPageComponent', () => {
  let component: TestRoutingPageComponent;
  let fixture: ComponentFixture<TestRoutingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestRoutingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRoutingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
