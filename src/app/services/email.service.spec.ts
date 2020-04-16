import { TestBed } from '@angular/core/testing';

import { EMailService } from './email.service';

describe('EmailService', () => {
  let service: EMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EMailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
