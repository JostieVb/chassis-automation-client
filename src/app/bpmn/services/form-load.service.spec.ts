import { TestBed, inject } from '@angular/core/testing';

import { FormLoadService } from './form-load.service';

describe('FormLoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormLoadService]
    });
  });

  it('should be created', inject([FormLoadService], (service: FormLoadService) => {
    expect(service).toBeTruthy();
  }));
});
