import { TestBed } from '@angular/core/testing';

import { TraderService } from './trader.service';

describe('TraderService', () => {
  let service: TraderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
