import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportItemComponent } from './transport-item.component';

describe('TransportItemComponent', () => {
  let component: TransportItemComponent;
  let fixture: ComponentFixture<TransportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
