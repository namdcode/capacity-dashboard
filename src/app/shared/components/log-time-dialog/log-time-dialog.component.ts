import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Employee, Project } from '../../../models';

export interface LogTimeDialogData {
  employees: Employee[];
  projects: Project[];
  preselectedEmployeeId?: string;
  preselectedDate?: string;
}

export interface LogTimeDialogResult {
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  isBillable: boolean;
  description: string;
}

@Component({
  selector: 'app-log-time-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="title-icon">schedule</mat-icon>
      Log Time
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Team Member</mat-label>
          <mat-select formControlName="employeeId">
            @for (emp of data.employees; track emp.id) {
              <mat-option [value]="emp.id">
                {{ emp.firstName }} {{ emp.lastName }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Project</mat-label>
          <mat-select formControlName="projectId">
            @for (proj of data.projects; track proj.id) {
              <mat-option [value]="proj.id">
                {{ proj.name }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput formControlName="date" type="date" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Hours</mat-label>
          <input matInput formControlName="hours" type="number" min="0.25" max="24" step="0.25" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>

        <mat-checkbox formControlName="isBillable" class="billable-check">
          Billable
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="form.invalid"
        (click)="submit()"
      >
        Log Time
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700 !important;
      letter-spacing: -0.3px;
    }

    .title-icon {
      color: var(--mat-sys-primary);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
      min-width: 440px;
      padding-top: 4px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .billable-check {
      grid-column: 1 / -1;
      margin-bottom: 8px;
    }
  `,
})
export class LogTimeDialogComponent {
  readonly data = inject<LogTimeDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<LogTimeDialogComponent>);

  readonly form = new FormGroup({
    employeeId: new FormControl(this.data.preselectedEmployeeId || '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    projectId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl(this.data.preselectedDate || new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    hours: new FormControl(8, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.25), Validators.max(24)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isBillable: new FormControl(true, { nonNullable: true }),
  });

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue() as LogTimeDialogResult);
    }
  }
}
