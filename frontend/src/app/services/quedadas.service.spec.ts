import { TestBed } from '@angular/core/testing';

import { QuedadasService } from './quedadas.service';

describe('QuedadasService', () => {
  let service: QuedadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuedadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
