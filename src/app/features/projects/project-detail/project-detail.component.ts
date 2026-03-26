import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ProjectService } from '../../../core/services/project.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { CapacityService } from '../../../core/services/capacity.service';
import { TimeEntryService } from '../../../core/services/time-entry.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { CurrencyFormatPipe, HoursDisplayPipe } from '../../../shared/pipes';
import { PRIMARY_SCHEME } from '../../../shared/chart-schemes';
import { ProjectStatus } from '../../../models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatMenuModule,
    NgxChartsModule,
    StatusBadgeComponent,
    KpiCardComponent,
    CurrencyFormatPipe,
    HoursDisplayPipe,
  ],
  template: `
    <div class="page-container">
      @if (project()) {
        <button mat-button class="back-btn" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon> Back to Projects
        </button>

        <mat-card class="hero-card">
          <div class="hero-content">
            <div class="hero-info">
              <div class="hero-title-row">
                <h1 class="hero-name">{{ project()!.name }}</h1>
                <app-status-badge [status]="project()!.status" />
                <button mat-icon-button [matMenuTriggerFor]="statusMenu" class="status-action">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #statusMenu="matMenu">
                  @for (s of statuses; track s.value) {
                    <button mat-menu-item (click)="changeStatus(s.value)" [disabled]="project()!.status === s.value">
                      <mat-icon>{{ s.icon }}</mat-icon>
                      <span>Mark as {{ s.label }}</span>
                    </button>
                  }
                </mat-menu>
              </div>
              <p class="hero-meta">
                {{ project()!.client }} &middot; {{ project()!.code }}
              </p>
              <p class="hero-dates">
                {{ project()!.startDate }} &rarr; {{ project()!.endDate }}
              </p>
            </div>
          </div>
        </mat-card>

        <div class="card-grid kpi-grid">
          <app-kpi-card
            label="Total Budget"
            [value]="(project()!.budgetAmount | currencyFormat)"
            icon="account_balance"
          />
          <app-kpi-card
            label="Hours Used"
            [value]="hoursUsed().toString() + 'h'"
            icon="schedule"
            [subtitle]="'of ' + project()!.budgetHours + 'h budget'"
          />
          <app-kpi-card
            label="Budget Consumed"
            [value]="percentUsed() + '%'"
            icon="pie_chart"
            [iconBg]="percentUsed() > 90 ? 'var(--app-status-at-risk-bg)' : 'var(--mat-sys-primary-container)'"
            [iconColor]="percentUsed() > 90 ? 'var(--app-status-at-risk)' : 'var(--mat-sys-on-primary-container)'"
          />
          <app-kpi-card
            label="Team Size"
            [value]="project()!.teamMemberIds.length.toString()"
            icon="people"
          />
        </div>

        @if (budgetBurnData().length > 0) {
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Budget Burn Rate</mat-card-title>
              <mat-card-subtitle>Cumulative hours used over time</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="chart-content">
              <ngx-charts-area-chart
                [results]="budgetBurnData()"
                [xAxis]="true"
                [yAxis]="true"
                [showXAxisLabel]="false"
                [showYAxisLabel]="true"
                [yAxisLabel]="'Hours'"
                [scheme]="chartScheme"
              />
            </mat-card-content>
          </mat-card>
        }

        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>Team Allocation</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="teamRows()">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let row">
                  <span class="cell-bold">{{ row.name }}</span>
                </td>
              </ng-container>
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let row">{{ row.role }}</td>
              </ng-container>
              <ng-container matColumnDef="hours">
                <th mat-header-cell *matHeaderCellDef>Hours</th>
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
                *matHeaderRowDef="['name', 'role', 'hours', 'billable']"
              ></tr>
              <tr
                mat-row
                *matRowDef="
                  let row;
                  columns: ['name', 'role', 'hours', 'billable']
                "
              ></tr>
            </table>
          </mat-card-content>
        </mat-card>
      } @else {
        <p>Project not found.</p>
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
      padding: 4px 0;
    }

    .hero-title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .hero-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }

    .status-action {
      margin-left: -8px;
      color: var(--mat-sys-on-surface-variant);
    }

    .hero-meta {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
      margin: 6px 0 2px;
    }

    .hero-dates {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
      opacity: 0.7;
    }

    .kpi-grid {
      margin-bottom: 24px;
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
export class ProjectDetailComponent {
  readonly chartScheme = PRIMARY_SCHEME;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly employeeService = inject(EmployeeService);
  private readonly capacityService = inject(CapacityService);
  private readonly timeEntryService = inject(TimeEntryService);
  private readonly snackBar = inject(MatSnackBar);

  readonly statuses: { value: ProjectStatus; label: string; icon: string }[] = [
    { value: 'active', label: 'Active', icon: 'play_circle' },
    { value: 'on-hold', label: 'On Hold', icon: 'pause_circle' },
    { value: 'at-risk', label: 'At Risk', icon: 'warning' },
    { value: 'completed', label: 'Completed', icon: 'check_circle' },
  ];

  private readonly projectId = toSignal(
    this.route.params.pipe(map((p) => p['id'] as string)),
    { initialValue: '' }
  );

  readonly project = computed(() => {
    const id = this.projectId();
    return id ? this.projectService.getById(id) : undefined;
  });

  readonly hoursUsed = computed(() => {
    const id = this.projectId();
    if (!id) return 0;
    return Math.round(
      this.timeEntryService
        .getByProjectId(id)
        .reduce((sum, e) => sum + e.hours, 0)
    );
  });

  readonly percentUsed = computed(() => {
    const proj = this.project();
    if (!proj) return 0;
    return Math.round((this.hoursUsed() / proj.budgetHours) * 100);
  });

  readonly budgetBurnData = computed(() => {
    const id = this.projectId();
    if (!id) return [];
    return this.capacityService.getProjectBudgetBurn(id);
  });

  readonly teamRows = computed(() => {
    const proj = this.project();
    if (!proj) return [];

    return proj.teamMemberIds.map((empId) => {
      const emp = this.employeeService.getById(empId);
      const entries = this.timeEntryService
        .getByProjectId(proj.id)
        .filter((e) => e.employeeId === empId);
      const hours = entries.reduce((sum, e) => sum + e.hours, 0);
      const billableHours = entries
        .filter((e) => e.isBillable)
        .reduce((sum, e) => sum + e.hours, 0);

      return {
        name: emp
          ? this.employeeService.getFullName(emp)
          : empId,
        role: emp?.role || '',
        hours,
        billableAmount: billableHours * (emp?.billableRate || 0),
      };
    });
  });

  changeStatus(status: ProjectStatus): void {
    const proj = this.project();
    if (!proj) return;
    this.projectService.updateStatus(proj.id, status);
    this.snackBar.open(
      `Project status changed to ${status.replace('-', ' ')}`,
      'OK',
      { duration: 3000 }
    );
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
