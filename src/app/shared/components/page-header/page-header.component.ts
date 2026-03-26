import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div class="page-header-accent"></div>
      <div>
        <h1 class="page-title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-subtitle">{{ subtitle() }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .page-header-accent {
      width: 4px;
      height: 40px;
      border-radius: 2px;
      background: linear-gradient(180deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
      flex-shrink: 0;
    }

    .page-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
      margin: 2px 0 0;
    }
  `,
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>();
}
