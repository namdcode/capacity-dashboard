import { Injectable, computed, signal } from '@angular/core';
import { Employee } from '../../models';
import { MOCK_EMPLOYEES } from '../../mock-data';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly employees = signal<Employee[]>(MOCK_EMPLOYEES);

  readonly all = this.employees.asReadonly();
  readonly active = computed(() => this.employees().filter((e) => e.isActive));
  readonly count = computed(() => this.active().length);

  getById(id: string): Employee | undefined {
    return this.employees().find((e) => e.id === id);
  }

  getInitials(employee: Employee): string {
    return `${employee.firstName[0]}${employee.lastName[0]}`;
  }

  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }
}
