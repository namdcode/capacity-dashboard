import { Component, computed, inject } from '@angular/core';
import { CapacityService } from '../../../core/services/capacity.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CapacityTrendChartComponent } from '../components/capacity-trend-chart/capacity-trend-chart.component';
import { BillablePieChartComponent } from '../components/billable-pie-chart/billable-pie-chart.component';
import { RevenueChartComponent } from '../components/revenue-chart/revenue-chart.component';
import { CurrencyFormatPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    KpiCardComponent,
    PageHeaderComponent,
    CapacityTrendChartComponent,
    BillablePieChartComponent,
    RevenueChartComponent,
  ],
  template: `
    <div class="page-container">
      <app-page-header
        title="Dashboard"
        subtitle="Team capacity and project performance at a glance"
      />

      <div class="card-grid">
        <app-kpi-card
          label="Team Size"
          [value]="totalEmployees().toString()"
          icon="people"
          subtitle="Across 5 departments"
        />
        <app-kpi-card
          label="Avg. Utilization"
          [value]="utilizationDisplay()"
          icon="speed"
          [iconBg]="'var(--mat-sys-tertiary-container)'"
          [iconColor]="'var(--mat-sys-on-tertiary-container)'"
          subtitle="Current month"
        />
        <app-kpi-card
          label="Billable Hours"
          [value]="billableHoursDisplay()"
          icon="schedule"
          subtitle="Current month"
        />
        <app-kpi-card
          label="Projected Revenue"
          [value]="revenueDisplay()"
          icon="euro"
          [iconBg]="'var(--app-revenue-bg)'"
          [iconColor]="'var(--app-revenue-fg)'"
          subtitle="Current month"
        />
      </div>

      <div class="chart-grid">
        @defer (on viewport) {
          <app-capacity-trend-chart [data]="utilizationTrend()" />
        } @placeholder {
          <div class="chart-placeholder">
            <div class="placeholder-pulse"></div>
          </div>
        }

        @defer (on viewport) {
          <app-billable-pie-chart [data]="billableBreakdown()" />
        } @placeholder {
          <div class="chart-placeholder">
            <div class="placeholder-pulse"></div>
          </div>
        }
      </div>

      <div class="chart-grid" style="margin-top: 0;">
        @defer (on viewport) {
          <app-revenue-chart [data]="revenueByProject()" />
        } @placeholder {
          <div class="chart-placeholder">
            <div class="placeholder-pulse"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .chart-placeholder {
      height: 360px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--mat-sys-surface);
      border-radius: var(--app-card-radius);
      border: 1px solid var(--mat-sys-outline-variant);
      overflow: hidden;
    }

    .placeholder-pulse {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--mat-sys-surface-container) 50%,
        transparent 100%
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
  `,
})
export class OverviewComponent {
  private readonly capacityService = inject(CapacityService);
  private readonly currencyPipe = new CurrencyFormatPipe();

  readonly totalEmployees = this.capacityService.totalEmployees;

  readonly utilizationDisplay = computed(
    () => `${Math.round(this.capacityService.averageUtilization() * 100)}%`
  );

  readonly billableHoursDisplay = computed(
    () => `${Math.round(this.capacityService.totalBillableHours()).toLocaleString()}`
  );

  readonly revenueDisplay = computed(() =>
    this.currencyPipe.transform(this.capacityService.projectedRevenue())
  );

  readonly utilizationTrend = computed(() =>
    this.capacityService.getUtilizationTrend(6)
  );

  readonly billableBreakdown = computed(() =>
    this.capacityService.getBillableBreakdown()
  );

  readonly revenueByProject = computed(() =>
    this.capacityService.getRevenueByProject()
  );
}
