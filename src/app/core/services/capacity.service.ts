import { Injectable, computed, inject } from '@angular/core';
import { EmployeeService } from './employee.service';
import { ProjectService } from './project.service';
import { TimeEntryService } from './time-entry.service';

@Injectable({ providedIn: 'root' })
export class CapacityService {
  private readonly employeeService = inject(EmployeeService);
  private readonly projectService = inject(ProjectService);
  private readonly timeEntryService = inject(TimeEntryService);

  readonly totalEmployees = this.employeeService.count;

  readonly averageUtilization = computed(() => {
    const employees = this.employeeService.active();
    const entries = this.timeEntryService.currentMonth();
    if (employees.length === 0) return 0;

    const workingDaysInMonth = this.getWorkingDaysInCurrentMonth();
    let totalUtil = 0;

    for (const emp of employees) {
      const empEntries = entries.filter((e) => e.employeeId === emp.id);
      const totalHours = empEntries.reduce((sum, e) => sum + e.hours, 0);
      const availableHours = workingDaysInMonth * 8;
      totalUtil += availableHours > 0 ? totalHours / availableHours : 0;
    }

    return totalUtil / employees.length;
  });

  readonly totalBillableHours = computed(() => {
    return this.timeEntryService
      .currentMonth()
      .filter((e) => e.isBillable)
      .reduce((sum, e) => sum + e.hours, 0);
  });

  readonly projectedRevenue = computed(() => {
    const entries = this.timeEntryService.currentMonth();
    const employees = this.employeeService.active();
    let revenue = 0;

    for (const entry of entries) {
      if (!entry.isBillable) continue;
      const emp = employees.find((e) => e.id === entry.employeeId);
      if (emp) {
        revenue += entry.hours * emp.billableRate;
      }
    }

    return revenue;
  });

  getUtilizationForEmployee(employeeId: string): number {
    const entries = this.timeEntryService.currentMonth();
    const empEntries = entries.filter((e) => e.employeeId === employeeId);
    const totalHours = empEntries.reduce((sum, e) => sum + e.hours, 0);
    const workingDays = this.getWorkingDaysInCurrentMonth();
    const availableHours = workingDays * 8;
    return availableHours > 0 ? totalHours / availableHours : 0;
  }

  getUtilizationTrend(months: number): { name: string; value: number }[] {
    const result: { name: string; value: number }[] = [];
    const now = new Date();
    const employees = this.employeeService.active();
    const allEntries = this.timeEntryService.all();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = date.toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });

      const monthEntries = allEntries.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });

      const workingDays = this.getWorkingDaysInMonth(year, month);
      let totalUtil = 0;

      for (const emp of employees) {
        const empHours = monthEntries
          .filter((e) => e.employeeId === emp.id)
          .reduce((sum, e) => sum + e.hours, 0);
        const available = workingDays * 8;
        totalUtil += available > 0 ? empHours / available : 0;
      }

      result.push({
        name: monthName,
        value:
          Math.round((totalUtil / Math.max(employees.length, 1)) * 100),
      });
    }

    return result;
  }

  getBillableBreakdown(): { name: string; value: number }[] {
    const entries = this.timeEntryService.currentMonth();
    const billable = entries
      .filter((e) => e.isBillable)
      .reduce((sum, e) => sum + e.hours, 0);
    const nonBillable = entries
      .filter((e) => !e.isBillable)
      .reduce((sum, e) => sum + e.hours, 0);

    return [
      { name: 'Billable', value: Math.round(billable) },
      { name: 'Non-Billable', value: Math.round(nonBillable) },
    ];
  }

  getRevenueByProject(): { name: string; value: number }[] {
    const entries = this.timeEntryService.currentMonth();
    const employees = this.employeeService.active();
    const projects = this.projectService.all();
    const revenueMap = new Map<string, number>();

    for (const entry of entries) {
      if (!entry.isBillable) continue;
      const emp = employees.find((e) => e.id === entry.employeeId);
      if (!emp) continue;
      const current = revenueMap.get(entry.projectId) || 0;
      revenueMap.set(entry.projectId, current + entry.hours * emp.billableRate);
    }

    return Array.from(revenueMap.entries())
      .map(([projectId, value]) => ({
        name:
          projects.find((p) => p.id === projectId)?.name || projectId,
        value: Math.round(value),
      }))
      .sort((a, b) => b.value - a.value);
  }

  getProjectBudgetBurn(
    projectId: string
  ): { name: string; series: { name: string; value: number }[] }[] {
    const entries = this.timeEntryService
      .getByProjectId(projectId)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (entries.length === 0) return [];

    const weeklyData = new Map<string, number>();
    let cumulative = 0;

    for (const entry of entries) {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = weekStart.toISOString().split('T')[0];

      cumulative += entry.hours;
      weeklyData.set(weekKey, cumulative);
    }

    return [
      {
        name: 'Hours Used',
        series: Array.from(weeklyData.entries()).map(([week, hours]) => ({
          name: new Date(week).toLocaleDateString('default', {
            month: 'short',
            day: 'numeric',
          }),
          value: Math.round(hours),
        })),
      },
    ];
  }

  private getWorkingDaysInCurrentMonth(): number {
    const now = new Date();
    return this.getWorkingDaysInMonth(now.getFullYear(), now.getMonth());
  }

  private getWorkingDaysInMonth(year: number, month: number): number {
    let count = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dow = date.getDay();
      if (dow !== 0 && dow !== 6) count++;
    }
    return count;
  }
}
