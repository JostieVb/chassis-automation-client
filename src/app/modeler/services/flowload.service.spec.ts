import { TestBed, inject } from '@angular/core/testing';

import { FlowLoadService } from './flowload.service';

describe('LoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlowLoadService]
    });
  });

  it('should be created', inject([FlowLoadService], (service: FlowLoadService) => {
    expect(service).toBeTruthy();
  }));
});
