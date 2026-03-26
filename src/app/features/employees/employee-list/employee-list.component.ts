import {
  Component,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map, startWith } from 'rxjs';

import { EmployeeService } from '../../../core/services/employee.service';
import { CapacityService } from '../../../core/services/capacity.service';
import { ProjectService } from '../../../core/services/project.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { UtilizationPipe } from '../../../shared/pipes';
import { Employee, Department, Role } from '../../../models';

interface EmployeeRow {
  employee: Employee;
  utilization: number;
  projectCount: number;
  fullName: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    PageHeaderComponent,
    UtilizationPipe,
  ],
  template: `
    <div class="page-container">
      <app-page-header
        title="People"
        subtitle="Team capacity and utilization overview"
      />

      <div class="toolbar-row">
        <div class="filters">
          <mat-form-field appearance="outline" class="filter-search">
            <mat-label>Search team members</mat-label>
            <input matInput [formControl]="searchControl" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          @if (!isMobile()) {
            <mat-form-field appearance="outline" class="filter-select">
              <mat-label>Department</mat-label>
              <mat-select [formControl]="departmentControl">
                <mat-option value="">All</mat-option>
                @for (dept of departments; track dept) {
                  <mat-option [value]="dept">{{ dept }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-select">
              <mat-label>Role</mat-label>
              <mat-select [formControl]="roleControl">
                <mat-option value="">All</mat-option>
                @for (role of roles; track role) {
                  <mat-option [value]="role">{{ role }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          }
        </div>

        <button mat-stroked-button (click)="exportCsv()" class="export-btn">
          <mat-icon>download</mat-icon>
          @if (!isMobile()) { Export CSV }
        </button>
      </div>

      <mat-card class="table-card">
        <table mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
            <td mat-cell *matCellDef="let row">
              <div class="employee-name">
                <div class="avatar">
                  {{ getInitials(row.employee) }}
                </div>
                <div class="name-info">
                  <span class="name-text">{{ row.fullName }}</span>
                  @if (isMobile()) {
                    <span class="role-sub">{{ row.employee.role }}</span>
                  }
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
            <td mat-cell *matCellDef="let row">
              <span class="role-text">{{ row.employee.role }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Department
            </th>
            <td mat-cell *matCellDef="let row">
              {{ row.employee.department }}
            </td>
          </ng-container>

          <ng-container matColumnDef="utilization">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Utilization
            </th>
            <td mat-cell *matCellDef="let row">
              <div class="utilization-cell">
                <mat-progress-bar
                  [mode]="'determinate'"
                  [value]="row.utilization * 100"
                  [color]="
                    row.utilization >= row.employee.targetUtilization
                      ? 'primary'
                      : 'warn'
                  "
                />
                <span class="utilization-value">{{
                  row.utilization | utilization
                }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="projects">
            <th mat-header-cell *matHeaderCellDef>Projects</th>
            <td mat-cell *matCellDef="let row">
              <span class="project-count">{{ row.projectCount }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="rate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Rate</th>
            <td mat-cell *matCellDef="let row">
              <span class="rate-text">&euro;{{ row.employee.billableRate }}/hr</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns()"
            (click)="onRowClick(row.employee.id)"
            class="clickable-row"
          ></tr>
        </table>

        <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 20]" />
      </mat-card>
    </div>
  `,
  styles: `
    .toolbar-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 4px;
    }

    .filters {
      display: flex;
      flex: 1;
      gap: 12px;
      flex-wrap: wrap;
    }

    .filter-search {
      flex: 1;
      min-width: 200px;
    }

    .filter-select {
      min-width: 160px;
    }

    .export-btn {
      margin-top: 4px;
      flex-shrink: 0;
      color: var(--mat-sys-on-surface-variant);
    }

    .export-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }

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

    .employee-name {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 4px 0;
    }

    .name-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--mat-sys-primary-container), var(--mat-sys-tertiary-container));
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      letter-spacing: 0.5px;
    }

    .name-text {
      font-weight: 600;
      font-size: 14px;
    }

    .role-sub {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .role-text {
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
    }

    .utilization-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 120px;
    }

    .utilization-value {
      font-size: 13px;
      font-weight: 600;
      min-width: 38px;
    }

    .project-count {
      font-weight: 600;
      font-size: 14px;
      color: var(--mat-sys-primary);
    }

    .rate-text {
      font-weight: 600;
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly capacityService = inject(CapacityService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((r) => r.matches)),
    { initialValue: false }
  );

  readonly displayedColumns = computed(() =>
    this.isMobile()
      ? ['name', 'utilization', 'projects']
      : ['name', 'role', 'department', 'utilization', 'projects', 'rate']
  );

  readonly departments: Department[] = [
    'Advisory',
    'Tax',
    'Audit',
    'Technology',
    'Operations',
  ];
  readonly roles: Role[] = [
    'Partner',
    'Director',
    'Senior Manager',
    'Manager',
    'Senior Consultant',
    'Consultant',
    'Analyst',
  ];

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly departmentControl = new FormControl('', { nonNullable: true });
  readonly roleControl = new FormControl('', { nonNullable: true });

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), startWith('')),
    { initialValue: '' }
  );
  private readonly departmentFilter = toSignal(
    this.departmentControl.valueChanges.pipe(startWith('')),
    { initialValue: '' }
  );
  private readonly roleFilter = toSignal(
    this.roleControl.valueChanges.pipe(startWith('')),
    { initialValue: '' }
  );

  readonly rows = computed<EmployeeRow[]>(() => {
    const search = this.searchTerm().toLowerCase();
    const dept = this.departmentFilter();
    const role = this.roleFilter();

    return this.employeeService
      .active()
      .filter((emp) => {
        const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        if (search && !name.includes(search)) return false;
        if (dept && emp.department !== dept) return false;
        if (role && emp.role !== role) return false;
        return true;
      })
      .map((employee) => ({
        employee,
        utilization: this.capacityService.getUtilizationForEmployee(employee.id),
        projectCount: this.projectService.getByEmployeeId(employee.id).length,
        fullName: this.employeeService.getFullName(employee),
      }));
  });

  dataSource = new MatTableDataSource<EmployeeRow>([]);

  constructor() {
    effect(() => {
      const sortRef = this.sort();
      const paginatorRef = this.paginator();
      if (sortRef) this.dataSource.sort = sortRef;
      if (paginatorRef) this.dataSource.paginator = paginatorRef;
    });

    effect(() => {
      this.dataSource.data = this.rows();
    });
  }

  getInitials(employee: Employee): string {
    return this.employeeService.getInitials(employee);
  }

  exportCsv(): void {
    const headers = ['Name', 'Role', 'Department', 'Utilization %', 'Projects', 'Rate (€/hr)'];
    const csvRows = [
      headers.join(','),
      ...this.rows().map((r) =>
        [
          r.fullName,
          r.employee.role,
          r.employee.department,
          Math.round(r.utilization * 100),
          r.projectCount,
          r.employee.billableRate,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team-members.csv';
    a.click();
    URL.revokeObjectURL(url);

    this.snackBar.open('CSV exported', 'OK', { duration: 2000 });
  }

  onRowClick(employeeId: string): void {
    this.router.navigate(['/employees', employeeId]);
  }
}
