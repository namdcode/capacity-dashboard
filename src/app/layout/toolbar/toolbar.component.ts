import { Component, inject, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <mat-toolbar class="toolbar">
      @if (isMobile()) {
        <button mat-icon-button (click)="toggleSidenav.emit()" class="menu-btn">
          <mat-icon>menu</mat-icon>
        </button>
      }
      <span class="toolbar-spacer"></span>

      <button
        mat-icon-button
        (click)="themeService.toggle()"
        [matTooltip]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        class="theme-toggle"
      >
        <mat-icon class="theme-icon">
          {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
        </mat-icon>
      </button>

      <div class="toolbar-badge">
        <div class="badge-dot"></div>
        Demo App
      </div>
    </mat-toolbar>
  `,
  styles: `
    .toolbar {
      background: var(--app-toolbar-bg) !important;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      height: 56px !important;
      padding: 0 24px !important;
      position: sticky;
      top: 0;
      z-index: 10;
      transition: background-color var(--app-transition-speed) ease,
                  border-color var(--app-transition-speed) ease;
    }

    .menu-btn {
      margin-right: 8px;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .theme-toggle {
      margin-right: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .theme-icon {
      transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .theme-toggle:hover .theme-icon {
      transform: rotate(45deg) scale(1.1);
    }

    .toolbar-badge {
      font: var(--mat-sys-label-small);
      font-weight: 600;
      letter-spacing: 0.3px;
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
      padding: 6px 14px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color var(--app-transition-speed) ease,
                  color var(--app-transition-speed) ease;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--mat-sys-on-tertiary-container);
      opacity: 0.6;
    }
  `,
})
export class ToolbarComponent {
  readonly themeService = inject(ThemeService);
  isMobile = input(false);
  toggleSidenav = output<void>();
}
