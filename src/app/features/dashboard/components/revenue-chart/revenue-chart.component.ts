import { Component, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { REVENUE_SCHEME } from '../../../../shared/chart-schemes';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [NgxChartsModule, MatCardModule],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>Revenue by Project</mat-card-title>
        <mat-card-subtitle>Current month billable revenue</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="chart-content">
        <ngx-charts-bar-horizontal
          [results]="data()"
          [xAxis]="true"
          [yAxis]="true"
          [scheme]="colorScheme"
          [xAxisTickFormatting]="formatCurrency"
          [roundDomains]="true"
          [barPadding]="10"
          [roundEdges]="true"
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
      display: block;
      width: 100%;
      min-height: 300px;
      padding-top: 8px !important;
    }

    .chart-content ::ng-deep ngx-charts-bar-horizontal,
    .chart-content ::ng-deep .ngx-charts-outer {
      width: 100% !important;
    }
  `,
})
export class RevenueChartComponent {
  data = input.required<{ name: string; value: number }[]>();
  readonly colorScheme = REVENUE_SCHEME;

  formatCurrency(value: number): string {
    if (value >= 1000) return `\u20AC${(value / 1000).toFixed(0)}K`;
    return `\u20AC${value}`;
  }
}
