import { Component, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { DUAL_SCHEME } from '../../../../shared/chart-schemes';

@Component({
  selector: 'app-billable-pie-chart',
  standalone: true,
  imports: [NgxChartsModule, MatCardModule],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>Billable Breakdown</mat-card-title>
        <mat-card-subtitle>Current month hours split</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="chart-content">
        <ngx-charts-pie-chart
          [results]="data()"
          [view]="[320, 240]"
          [labels]="true"
          [doughnut]="true"
          [arcWidth]="0.35"
          [scheme]="colorScheme"
        />
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
    }

    .chart-card {
      height: 100%;
    }

    mat-card-header {
      padding-bottom: 8px;
    }

    .chart-content {
      display: flex;
      justify-content: center;
      padding-top: 8px !important;
      overflow: hidden;
    }
  `,
})
export class BillablePieChartComponent {
  data = input.required<{ name: string; value: number }[]>();
  readonly colorScheme = DUAL_SCHEME;
}
