import { Injectable, computed, signal } from '@angular/core';
import { TimeEntry } from '../../models';
import { generateTimeEntries } from '../../mock-data';

@Injectable({ providedIn: 'root' })
export class TimeEntryService {
  private readonly entries = signal<TimeEntry[]>(generateTimeEntries());

  readonly all = this.entries.asReadonly();

  readonly currentMonth = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return this.entries().filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  });

  getByEmployeeId(employeeId: string): TimeEntry[] {
    return this.entries().filter((e) => e.employeeId === employeeId);
  }

  getByProjectId(projectId: string): TimeEntry[] {
    return this.entries().filter((e) => e.projectId === projectId);
  }

  getByDateRange(start: string, end: string): TimeEntry[] {
    return this.entries().filter((e) => e.date >= start && e.date <= end);
  }

  getByEmployeeAndDateRange(
    employeeId: string,
    start: string,
    end: string
  ): TimeEntry[] {
    return this.entries().filter(
      (e) =>
        e.employeeId === employeeId && e.date >= start && e.date <= end
    );
  }

  addEntry(entry: Omit<TimeEntry, 'id'>): void {
    const id = `te-${String(this.entries().length + 1).padStart(5, '0')}`;
    this.entries.update((entries) => [...entries, { ...entry, id }]);
  }

  deleteEntry(id: string): void {
    this.entries.update((entries) => entries.filter((e) => e.id !== id));
  }
}
