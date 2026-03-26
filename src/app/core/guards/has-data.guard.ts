import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

export const hasDataGuard: CanActivateFn = () => {
  const employeeService = inject(EmployeeService);
  return employeeService.count() > 0;
};
