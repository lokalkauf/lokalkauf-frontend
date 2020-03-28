import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderEmailComponent } from './trader-email.component';

describe('TraderEmailComponent', () => {
  let component: TraderEmailComponent;
  let fixture: ComponentFixture<TraderEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
