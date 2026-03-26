import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <mat-card class="kpi-card">
      <mat-card-content class="kpi-content">
        <div class="kpi-icon-wrapper" [style.background]="iconBg()">
          <mat-icon [style.color]="iconColor()">{{ icon() }}</mat-icon>
        </div>
        <div class="kpi-info">
          <span class="kpi-label">{{ label() }}</span>
          <span class="kpi-value">{{ value() }}</span>
          @if (subtitle()) {
            <span class="kpi-subtitle">{{ subtitle() }}</span>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .kpi-card {
      height: 100%;
      cursor: default;
    }

    .kpi-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--app-card-shadow-hover) !important;
    }

    .kpi-content {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 12px 8px !important;
    }

    .kpi-icon-wrapper {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background-color var(--app-transition-speed) ease;
    }

    .kpi-icon-wrapper mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .kpi-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .kpi-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .kpi-value {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1.2;
      color: var(--mat-sys-on-surface);
    }

    .kpi-subtitle {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 1px;
    }
  `,
})
export class KpiCardComponent {
  label = input.required<string>();
  value = input.required<string>();
  icon = input.required<string>();
  subtitle = input<string>();
  iconBg = input('var(--mat-sys-primary-container)');
  iconColor = input('var(--mat-sys-on-primary-container)');
}
