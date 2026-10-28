import { TestBed } from '@angular/core/testing';

import { NeuroService } from './neuro.service';

describe('NeuroService', () => {
  let service: NeuroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeuroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
