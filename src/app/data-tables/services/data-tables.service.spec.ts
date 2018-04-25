import { TestBed, inject } from '@angular/core/testing';

import { DataTablesService } from './data-tables.service';

describe('DataTablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTablesService]
    });
  });

  it('should be created', inject([DataTablesService], (service: DataTablesService) => {
    expect(service).toBeTruthy();
  }));
});
