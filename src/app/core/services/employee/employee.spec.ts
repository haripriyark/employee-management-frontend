import { TestBed } from '@angular/core/testing';
import { EmployeeList } from './employee-list';

describe('EmployeeList', () => {
  let service: EmployeeList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
