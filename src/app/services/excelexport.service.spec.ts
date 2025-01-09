import { TestBed } from '@angular/core/testing';

import { ExcelexportService } from './excelexport.service';

describe('ExcelexportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelexportService = TestBed.get(ExcelexportService);
    expect(service).toBeTruthy();
  });
});
