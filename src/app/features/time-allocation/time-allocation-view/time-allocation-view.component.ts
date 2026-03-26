import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EmployeeService } from '../../../core/services/employee.service';
import { TimeEntryService } from '../../../core/services/time-entry.service';
import { ProjectService } from '../../../core/services/project.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  LogTimeDialogComponent,
  LogTimeDialogData,
  LogTimeDialogResult,
} from '../../../shared/components/log-time-dialog/log-time-dialog.component';

interface HeatmapCell {
  hours: number;
  entries: { project: string; hours: number }[];
}

@Component({
  selector: 'app-time-allocation-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DecimalPipe,
    PageHeaderComponent,
  ],
  template: `
    <div class="page-container">
      <app-page-header
        title="Time Allocation"
        subtitle="Weekly view of team hours and project assignments"
      />

      <div class="action-bar">
        <div class="week-selector">
          <button mat-icon-button (click)="prevWeek()" class="week-btn">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="week-label">{{ weekLabel() }}</span>
          <button mat-icon-button (click)="nextWeek()" class="week-btn">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>

        <div class="action-buttons">
          <button mat-stroked-button (click)="exportCsv()" class="action-btn">
            <mat-icon>download</mat-icon>
            Export CSV
          </button>
          <button mat-flat-button color="primary" (click)="openLogTime()" class="action-btn">
            <mat-icon>add</mat-icon>
            Log Time
          </button>
        </div>
      </div>

      <mat-card class="heatmap-card">
        <mat-card-content>
          <div class="heatmap-container">
            <div class="heatmap-grid">
              <!-- Header row -->
              <div class="heatmap-header-cell employee-label">Team Member</div>
              @for (day of weekDays(); track day.date) {
                <div class="heatmap-header-cell">
                  <span class="day-name">{{ day.name }}</span>
                  <span class="day-date">{{ day.label }}</span>
                </div>
              }
              <div class="heatmap-header-cell">Total</div>

              <!-- Data rows -->
              @for (emp of employees(); track emp.id) {
                <div class="heatmap-employee-cell">
                  <div class="emp-avatar-small">
                    {{ emp.firstName[0] }}{{ emp.lastName[0] }}
                  </div>
                  <span class="emp-name-small">
                    {{ emp.firstName }} {{ emp.lastName[0] }}.
                  </span>
                </div>
                @for (day of weekDays(); track day.date) {
                  @let cell = getCellData(emp.id, day.date);
                  <div
                    class="heatmap-cell"
                    [style.background]="getHeatColor(cell.hours)"
                    [matTooltip]="getCellTooltip(emp.firstName, day.label, cell)"
                    (click)="openLogTime(emp.id, day.date)"
                  >
                    @if (cell.hours > 0) {
                      {{ cell.hours | number : '1.0-1' }}
                    } @else {
                      <mat-icon class="add-hint">add</mat-icon>
                    }
                  </div>
                }
                <div class="heatmap-total-cell">
                  {{ getWeekTotal(emp.id) | number : '1.0-1' }}h
                </div>
              }
            </div>
          </div>

          <div class="legend">
            <span class="legend-label">Hours:</span>
            <div class="legend-item heat-0">0</div>
            <div class="legend-item heat-1">1-4</div>
            <div class="legend-item heat-2">4-6</div>
            <div class="legend-item heat-3">6-8</div>
            <div class="legend-item heat-4">8+</div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }

    .week-selector {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .week-btn {
      color: var(--mat-sys-on-surface-variant);
    }

    .week-label {
      font-size: 16px;
      font-weight: 700;
      min-width: 220px;
      text-align: center;
      letter-spacing: -0.2px;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .action-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }

    .heatmap-card {
      overflow: hidden;
    }

    .heatmap-container {
      overflow-x: auto;
    }

    .heatmap-grid {
      display: grid;
      grid-template-columns: 200px repeat(5, 1fr) 90px;
      gap: 3px;
      min-width: 720px;
    }

    .heatmap-header-cell {
      padding: 10px 8px;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .heatmap-header-cell.employee-label {
      text-align: left;
      align-items: flex-start;
    }

    .day-name {
      font-weight: 700;
      font-size: 12px;
    }

    .day-date {
      font-size: 11px;
      font-weight: 400;
      opacity: 0.7;
      text-transform: none;
    }

    .heatmap-employee-cell {
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .emp-avatar-small {
      width: 30px;
      height: 30px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--mat-sys-primary-container), var(--mat-sys-tertiary-container));
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      letter-spacing: 0.5px;
    }

    .emp-name-small {
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    .heatmap-cell {
      padding: 8px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      transition: transform 100ms ease, box-shadow 100ms ease;
    }

    .heatmap-cell:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1;
    }

    .heatmap-cell .add-hint {
      font-size: 16px;
      width: 16px;
      height: 16px;
      opacity: 0;
      color: var(--mat-sys-on-surface-variant);
      transition: opacity 150ms ease;
    }

    .heatmap-cell:hover .add-hint {
      opacity: 0.5;
    }

    .heatmap-total-cell {
      padding: 10px 8px;
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      color: var(--mat-sys-primary);
    }

    .legend {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--mat-sys-outline-variant);
      justify-content: flex-end;
    }

    .legend-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
      margin-right: 4px;
    }

    .legend-item {
      width: 40px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
    }

    .heat-0 { background: var(--app-heat-0); }
    .heat-1 { background: var(--app-heat-1); }
    .heat-2 { background: var(--app-heat-2); }
    .heat-3 { background: var(--app-heat-3); color: white; }
    .heat-4 { background: var(--app-heat-4); color: white; }
  `,
})
export class TimeAllocationViewComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly timeEntryService = inject(TimeEntryService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly weekOffset = signal(0);

  readonly employees = this.employeeService.active;

  readonly weekStart = computed(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1 + this.weekOffset() * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  readonly weekLabel = computed(() => {
    const start = this.weekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} \u2013 ${end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  });

  readonly weekDays = computed(() => {
    const start = this.weekStart();
    const days: { date: string; name: string; label: string }[] = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        name: date.toLocaleDateString('default', { weekday: 'short' }),
        label: date.toLocaleDateString('default', {
          month: 'short',
          day: 'numeric',
        }),
      });
    }
    return days;
  });

  getCellData(employeeId: string, date: string): HeatmapCell {
    const entries = this.timeEntryService
      .getByEmployeeAndDateRange(employeeId, date, date);

    const projectHours = new Map<string, number>();
    let totalHours = 0;

    for (const entry of entries) {
      totalHours += entry.hours;
      const current = projectHours.get(entry.projectId) || 0;
      projectHours.set(entry.projectId, current + entry.hours);
    }

    return {
      hours: Math.round(totalHours * 10) / 10,
      entries: Array.from(projectHours.entries()).map(([projectId, hours]) => ({
        project:
          this.projectService.getById(projectId)?.name || projectId,
        hours: Math.round(hours * 10) / 10,
      })),
    };
  }

  getWeekTotal(employeeId: string): number {
    const days = this.weekDays();
    if (days.length === 0) return 0;
    const entries = this.timeEntryService.getByEmployeeAndDateRange(
      employeeId,
      days[0].date,
      days[days.length - 1].date
    );
    return Math.round(entries.reduce((sum, e) => sum + e.hours, 0) * 10) / 10;
  }

  getHeatColor(hours: number): string {
    if (hours === 0) return 'var(--app-heat-0)';
    if (hours < 4) return 'var(--app-heat-1)';
    if (hours < 6) return 'var(--app-heat-2)';
    if (hours < 8) return 'var(--app-heat-3)';
    return 'var(--app-heat-4)';
  }

  getCellTooltip(
    name: string,
    day: string,
    cell: HeatmapCell
  ): string {
    if (cell.hours === 0) return `${name} - ${day}: Click to log time`;
    const projects = cell.entries
      .map((e) => `${e.project}: ${e.hours}h`)
      .join('\n');
    return `${name} - ${day}\nTotal: ${cell.hours}h\n${projects}\n\nClick to add more`;
  }

  openLogTime(employeeId?: string, date?: string): void {
    const dialogData: LogTimeDialogData = {
      employees: this.employeeService.active(),
      projects: this.projectService.active(),
      preselectedEmployeeId: employeeId,
      preselectedDate: date,
    };

    const dialogRef = this.dialog.open(LogTimeDialogComponent, {
      data: dialogData,
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result: LogTimeDialogResult | undefined) => {
      if (result) {
        this.timeEntryService.addEntry({
          employeeId: result.employeeId,
          projectId: result.projectId,
          date: result.date,
          hours: result.hours,
          isBillable: result.isBillable,
          description: result.description,
        });
        this.snackBar.open('Time entry logged successfully', 'OK', {
          duration: 3000,
        });
      }
    });
  }

  exportCsv(): void {
    const days = this.weekDays();
    const emps = this.employees();
    const rows: string[] = ['Team Member,' + days.map((d) => d.label).join(',') + ',Total'];

    for (const emp of emps) {
      const name = `${emp.firstName} ${emp.lastName}`;
      const dayHours = days.map((d) => this.getCellData(emp.id, d.date).hours);
      const total = this.getWeekTotal(emp.id);
      rows.push(`${name},${dayHours.join(',')},${total}`);
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-allocation-${days[0]?.date || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    this.snackBar.open('CSV exported', 'OK', { duration: 2000 });
  }

  prevWeek(): void {
    this.weekOffset.update((v) => v - 1);
  }

  nextWeek(): void {
    this.weekOffset.update((v) => v + 1);
  }
}
