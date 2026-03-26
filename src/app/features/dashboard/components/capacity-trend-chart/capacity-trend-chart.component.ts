import { Component, ElementRef, HostListener, OnInit, input, signal } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { PRIMARY_SCHEME } from '../../../../shared/chart-schemes';

@Component({
  selector: 'app-capacity-trend-chart',
  standalone: true,
  imports: [NgxChartsModule, MatCardModule],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title>Utilization Trend</mat-card-title>
        <mat-card-subtitle>Average team utilization over 6 months</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="chart-content">
        <ngx-charts-line-chart
          [results]="chartData()"
          [view]="view()"
          [xAxis]="true"
          [yAxis]="true"
          [showXAxisLabel]="false"
          [showYAxisLabel]="true"
          [yAxisLabel]="'Utilization %'"
          [yScaleMin]="0"
          [yScaleMax]="100"
          [autoScale]="false"
          [scheme]="colorScheme"
          [roundDomains]="true"
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
      padding-top: 8px !important;
      overflow: hidden;
    }
  `,
})
export class CapacityTrendChartComponent implements OnInit {
  data = input.required<{ name: string; value: number }[]>();
  readonly colorScheme = PRIMARY_SCHEME;
  readonly view = signal<[number, number]>([500, 260]);

  chartData = () => [{ name: 'Utilization', series: this.data() }];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.updateView();
  }

  @HostListener('window:resize')
  updateView(): void {
    const width = this.el.nativeElement.offsetWidth || 500;
    this.view.set([width, 260]);
  }
}
