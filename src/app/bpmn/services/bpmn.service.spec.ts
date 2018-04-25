import { TestBed, inject } from '@angular/core/testing';

import { BpmnService } from './bpmn.service';

describe('BpmnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BpmnService]
    });
  });

  it('should be created', inject([BpmnService], (service: BpmnService) => {
    expect(service).toBeTruthy();
  }));
});
