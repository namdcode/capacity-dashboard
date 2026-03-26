import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ProjectService } from '../../../core/services/project.service';
import { TimeEntryService } from '../../../core/services/time-entry.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CurrencyFormatPipe } from '../../../shared/pipes';
import { Project } from '../../../models';

interface ProjectRow {
  project: Project;
  hoursUsed: number;
  percentUsed: number;
  teamSize: number;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    CurrencyFormatPipe,
  ],
  template: `
    <div class="page-container">
      <app-page-header
        title="Projects"
        subtitle="Track project budgets and team allocation"
      />

      <mat-card class="table-card">
        <table mat-table [dataSource]="rows()">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let row">
              <div class="project-name">
                <span class="name">{{ row.project.name }}</span>
                <div class="project-meta">
                  <span class="code">{{ row.project.code }}</span>
                  @if (isMobile()) {
                    <app-status-badge [status]="row.project.status" />
                  }
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef>Client</th>
            <td mat-cell *matCellDef="let row">{{ row.project.client }}</td>
          </ng-container>

          <ng-container matColumnDef="budget">
            <th mat-header-cell *matHeaderCellDef>Budget</th>
            <td mat-cell *matCellDef="let row">
              <div class="budget-cell">
                <mat-progress-bar
                  mode="determinate"
                  [value]="row.percentUsed"
                  [color]="row.percentUsed > 90 ? 'warn' : 'primary'"
                />
                <span class="budget-text">
                  {{ row.hoursUsed }}h / {{ row.project.budgetHours }}h
                </span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let row">
              <span class="amount-text">{{ row.project.budgetAmount | currencyFormat }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <app-status-badge [status]="row.project.status" />
            </td>
          </ng-container>

          <ng-container matColumnDef="team">
            <th mat-header-cell *matHeaderCellDef>Team</th>
            <td mat-cell *matCellDef="let row">
              <div class="team-count">
                <mat-icon>people</mat-icon>
                <span>{{ row.teamSize }}</span>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns()"
            (click)="onRowClick(row.project.id)"
            class="clickable-row"
          ></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: `
    .table-card {
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;
      transition: background-color 120ms ease;
    }

    .clickable-row:hover {
      background: var(--app-table-row-hover) !important;
    }

    .project-name {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 6px 0;
    }

    .project-name .name {
      font-weight: 600;
      font-size: 14px;
    }

    .project-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .project-name .code {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      opacity: 0.7;
    }

    .budget-cell {
      min-width: 140px;
    }

    .budget-text {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
      display: block;
    }

    .amount-text {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .team-count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--mat-sys-on-surface-variant);
    }

    .team-count mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.6;
    }

    .team-count span {
      font-weight: 600;
      font-size: 14px;
    }
  `,
})
export class ProjectListComponent {
  private readonly projectService = inject(ProjectService);
  private readonly timeEntryService = inject(TimeEntryService);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((r) => r.matches)),
    { initialValue: false }
  );

  readonly displayedColumns = computed(() =>
    this.isMobile()
      ? ['name', 'budget']
      : ['name', 'client', 'budget', 'amount', 'status', 'team']
  );

  readonly rows = computed<ProjectRow[]>(() =>
    this.projectService.all().map((project) => {
      const entries = this.timeEntryService.getByProjectId(project.id);
      const hoursUsed = Math.round(
        entries.reduce((sum, e) => sum + e.hours, 0)
      );
      return {
        project,
        hoursUsed,
        percentUsed: (hoursUsed / project.budgetHours) * 100,
        teamSize: project.teamMemberIds.length,
      };
    })
  );

  onRowClick(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
