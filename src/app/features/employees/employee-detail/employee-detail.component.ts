import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { EmployeeService } from '../../../core/services/employee.service';
import { CapacityService } from '../../../core/services/capacity.service';
import { ProjectService } from '../../../core/services/project.service';
import { TimeEntryService } from '../../../core/services/time-entry.service';
import { UtilizationPipe, CurrencyFormatPipe, HoursDisplayPipe } from '../../../shared/pipes';
import { MULTI_SCHEME } from '../../../shared/chart-schemes';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    NgxChartsModule,
    UtilizationPipe,
    CurrencyFormatPipe,
    HoursDisplayPipe,
  ],
  template: `
    <div class="page-container">
      @if (employee()) {
        <button mat-button class="back-btn" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon> Back to People
        </button>

        <mat-card class="hero-card">
          <div class="hero-content">
            <div class="avatar-large">
              {{ initials() }}
            </div>
            <div class="hero-info">
              <h1 class="hero-name">{{ fullName() }}</h1>
              <p class="hero-role">
                {{ employee()!.role }} &middot; {{ employee()!.department }}
              </p>
              <p class="hero-email">{{ employee()!.email }}</p>
            </div>
            <div class="hero-rate">
              <span class="rate-label">Billable Rate</span>
              <span class="rate-value">&euro;{{ employee()!.billableRate }}/hr</span>
            </div>
          </div>
        </mat-card>

        <div class="card-grid metrics-grid">
          <mat-card class="metric-card">
            <mat-card-content>
              <span class="metric-label">Current Utilization</span>
              <div class="utilization-display">
                <mat-progress-bar
                  mode="determinate"
                  [value]="utilization() * 100"
                  [color]="
                    utilization() >= employee()!.targetUtilization
                      ? 'primary'
                      : 'warn'
                  "
                />
                <span class="utilization-value">{{
                  utilization() | utilization
                }}</span>
              </div>
              <span class="metric-target">
                Target: {{ employee()!.targetUtilization | utilization }}
              </span>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <span class="metric-label">Total Hours (This Month)</span>
              <span class="metric-value">{{
                totalHoursThisMonth() | hoursDisplay
              }}</span>
            </mat-card-content>
          </mat-card>

          <mat-card class="metric-card">
            <mat-card-content>
              <span class="metric-label">Revenue Generated</span>
              <span class="metric-value">{{
                revenueGenerated() | currencyFormat
              }}</span>
              <span class="metric-target">Current month</span>
            </mat-card-content>
          </mat-card>
        </div>

        @if (weeklyChartData().length > 0) {
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Weekly Hours by Project</mat-card-title>
            </mat-card-header>
            <mat-card-content class="chart-content">
              <ngx-charts-bar-vertical-stacked
                [results]="weeklyChartData()"
                [xAxis]="true"
                [yAxis]="true"
                [showXAxisLabel]="false"
                [showYAxisLabel]="true"
                [yAxisLabel]="'Hours'"
                [scheme]="chartScheme"
                [barPadding]="12"
              />
            </mat-card-content>
          </mat-card>
        }

        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>Project Assignments</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="projectRows()">
              <ng-container matColumnDef="project">
                <th mat-header-cell *matHeaderCellDef>Project</th>
                <td mat-cell *matCellDef="let row">
                  <span class="cell-bold">{{ row.name }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="client">
                <th mat-header-cell *matHeaderCellDef>Client</th>
                <td mat-cell *matCellDef="let row">{{ row.client }}</td>
              </ng-container>
              <ng-container matColumnDef="hours">
                <th mat-header-cell *matHeaderCellDef>Hours Logged</th>
                <td mat-cell *matCellDef="let row">
                  {{ row.hours | hoursDisplay }}
                </td>
              </ng-container>
              <ng-container matColumnDef="billable">
                <th mat-header-cell *matHeaderCellDef>Billable Amount</th>
                <td mat-cell *matCellDef="let row">
                  <span class="cell-bold">{{ row.billableAmount | currencyFormat }}</span>
                </td>
              </ng-container>
              <tr
                mat-header-row
                *matHeaderRowDef="['project', 'client', 'hours', 'billable']"
              ></tr>
              <tr
                mat-row
                *matRowDef="
                  let row;
                  columns: ['project', 'client', 'hours', 'billable']
                "
              ></tr>
            </table>
          </mat-card-content>
        </mat-card>
      } @else {
        <p>Team member not found.</p>
      }
    </div>
  `,
  styles: `
    .back-btn {
      margin-bottom: 8px;
      color: var(--mat-sys-on-surface-variant);
    }

    .hero-card {
      margin-bottom: 24px;
    }

    .hero-content {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 8px 0;
      flex-wrap: wrap;
    }

    .avatar-large {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      flex-shrink: 0;
      letter-spacing: 1px;
      box-shadow: 0 8px 24px rgba(124, 77, 255, 0.25);
    }

    .hero-info {
      flex: 1;
      min-width: 200px;
    }

    .hero-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }

    .hero-role {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
      margin: 4px 0 2px;
    }

    .hero-email {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
      opacity: 0.7;
    }

    .hero-rate {
      text-align: center;
      padding: 16px 24px;
      background: var(--mat-sys-primary-container);
      border-radius: var(--app-card-radius-sm);
      transition: background-color var(--app-transition-speed) ease;
    }

    .rate-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--mat-sys-on-primary-container);
      opacity: 0.7;
    }

    .rate-value {
      display: block;
      font-size: 22px;
      font-weight: 800;
      color: var(--mat-sys-on-primary-container);
      margin-top: 2px;
    }

    .metrics-grid {
      margin-bottom: 24px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .metric-card mat-card-content {
      padding: 4px 0 !important;
    }

    .metric-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--mat-sys-on-surface-variant);
    }

    .metric-value {
      font-size: 28px;
      font-weight: 800;
      display: block;
      margin: 6px 0 2px;
      letter-spacing: -0.5px;
    }

    .metric-target {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .utilization-display {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 10px 0 6px;
    }

    .utilization-value {
      font-size: 18px;
      font-weight: 700;
    }

    .section-card {
      margin-bottom: 24px;
    }

    .chart-content {
      display: block;
      width: 100%;
      min-height: 280px;
      padding-top: 8px !important;
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    .cell-bold {
      font-weight: 600;
    }
  `,
})
export class EmployeeDetailComponent {
  readonly chartScheme = MULTI_SCHEME;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly capacityService = inject(CapacityService);
  private readonly projectService = inject(ProjectService);
  private readonly timeEntryService = inject(TimeEntryService);

  private readonly employeeId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' }
  );

  readonly employee = computed(() => {
    const id = this.employeeId();
    return id ? this.employeeService.getById(id) : undefined;
  });

  readonly fullName = computed(() => {
    const emp = this.employee();
    return emp ? this.employeeService.getFullName(emp) : '';
  });

  readonly initials = computed(() => {
    const emp = this.employee();
    return emp ? this.employeeService.getInitials(emp) : '';
  });

  readonly utilization = computed(() => {
    const id = this.employeeId();
    return id ? this.capacityService.getUtilizationForEmployee(id) : 0;
  });

  readonly totalHoursThisMonth = computed(() => {
    const id = this.employeeId();
    if (!id) return 0;
    return this.timeEntryService
      .getByEmployeeId(id)
      .filter((e) => {
        const d = new Date(e.date);
        const now = new Date();
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth()
        );
      })
      .reduce((sum, e) => sum + e.hours, 0);
  });

  readonly revenueGenerated = computed(() => {
    const emp = this.employee();
    if (!emp) return 0;
    return this.totalHoursThisMonth() * emp.billableRate * 0.82;
  });

  readonly projectRows = computed(() => {
    const id = this.employeeId();
    if (!id) return [];

    const projects = this.projectService.getByEmployeeId(id);
    const entries = this.timeEntryService.getByEmployeeId(id);
    const emp = this.employee();

    return projects.map((project) => {
      const projectEntries = entries.filter(
        (e) => e.projectId === project.id
      );
      const hours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
      const billableHours = projectEntries
        .filter((e) => e.isBillable)
        .reduce((sum, e) => sum + e.hours, 0);

      return {
        name: project.name,
        client: project.client,
        hours,
        billableAmount: billableHours * (emp?.billableRate || 0),
      };
    });
  });

  readonly weeklyChartData = computed(() => {
    const id = this.employeeId();
    if (!id) return [];

    const entries = this.timeEntryService.getByEmployeeId(id);
    const projects = this.projectService.getByEmployeeId(id);

    const weekMap = new Map<
      string,
      Map<string, number>
    >();

    for (const entry of entries) {
      const date = new Date(entry.date);
      const now = new Date();
      const weeksAgo = (now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000);
      if (weeksAgo > 8) continue;

      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = weekStart.toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
      });

      if (!weekMap.has(weekKey)) weekMap.set(weekKey, new Map());
      const projectMap = weekMap.get(weekKey)!;
      const current = projectMap.get(entry.projectId) || 0;
      projectMap.set(entry.projectId, current + entry.hours);
    }

    return Array.from(weekMap.entries())
      .map(([week, projectMap]) => ({
        name: week,
        series: Array.from(projectMap.entries()).map(
          ([projectId, hours]) => ({
            name:
              projects.find((p) => p.id === projectId)?.name || projectId,
            value: Math.round(hours * 10) / 10,
          })
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
