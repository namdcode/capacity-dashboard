import { Component, computed, input } from '@angular/core';
import { ProjectStatus } from '../../../models';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; colorVar: string; bgVar: string }> = {
  active: { label: 'Active', colorVar: '--app-status-active', bgVar: '--app-status-active-bg' },
  completed: { label: 'Completed', colorVar: '--app-status-completed', bgVar: '--app-status-completed-bg' },
  'on-hold': { label: 'On Hold', colorVar: '--app-status-on-hold', bgVar: '--app-status-on-hold-bg' },
  'at-risk': { label: 'At Risk', colorVar: '--app-status-at-risk', bgVar: '--app-status-at-risk-bg' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="badge"
      [style.background]="'var(' + config().bgVar + ')'"
      [style.color]="'var(' + config().colorVar + ')'"
      [style.border-color]="'var(' + config().colorVar + ')'"
    >
      <span class="badge-dot" [style.background]="'var(' + config().colorVar + ')'"></span>
      {{ config().label }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.2px;
      border: 1px solid;
      border-opacity: 0.2;
      transition: all var(--app-transition-speed) ease;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `,
})
export class StatusBadgeComponent {
  status = input.required<ProjectStatus>();
  config = computed(() => STATUS_CONFIG[this.status()]);
}
