import { TestBed } from '@angular/core/testing';

import { MuiService } from './mui.service';

describe('MuiService', () => {
  let service: MuiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
