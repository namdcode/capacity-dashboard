import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  template: `
    <div class="sidebar-header">
      <div class="sidebar-logo-icon">
        <mat-icon>insights</mat-icon>
      </div>
      <div class="sidebar-brand">
        <span class="sidebar-logo">Capacity</span>
        <span class="sidebar-subtitle">Analytics</span>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <nav class="sidebar-nav">
      @for (item of navItems; track item.route) {
        <a
          class="nav-item"
          [routerLink]="item.route"
          routerLinkActive="nav-item--active"
          [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
          (click)="navigated.emit()"
        >
          <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      }
    </nav>

    <div class="sidebar-spacer"></div>

    <!-- Tech Stack -->
    <div class="tech-stack">
      <p class="tech-title">Built with</p>
      <div class="tech-chips">
        <span class="tech-chip">
          <mat-icon class="chip-icon">code</mat-icon>
          Angular 21
        </span>
        <span class="tech-chip">
          <mat-icon class="chip-icon">palette</mat-icon>
          Material M3
        </span>
        <span class="tech-chip">
          <mat-icon class="chip-icon">bolt</mat-icon>
          Signals
        </span>
      </div>
    </div>

    <div class="sidebar-divider"></div>

    <!-- User Profile -->
    <div class="user-profile">
      <div class="user-avatar">SM</div>
      <div class="user-info">
        <span class="user-name">Sophie Martin</span>
        <span class="user-role">Partner · Advisory</span>
      </div>
      <div class="user-status" matTooltip="Online"></div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--app-sidebar-bg);
      transition: background-color var(--app-transition-speed) ease;
    }

    .sidebar-header {
      padding: 24px 20px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .sidebar-logo-icon {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(124, 77, 255, 0.3);
    }

    .sidebar-logo-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .sidebar-brand {
      display: flex;
      flex-direction: column;
    }

    .sidebar-logo {
      font-size: 18px;
      font-weight: 800;
      color: var(--mat-sys-on-surface);
      letter-spacing: -0.3px;
      line-height: 1.2;
    }

    .sidebar-subtitle {
      font-size: 12px;
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
      letter-spacing: 0.3px;
    }

    .sidebar-divider {
      height: 1px;
      margin: 0 20px;
      background: var(--mat-sys-outline-variant);
      opacity: 0.5;
    }

    .sidebar-nav {
      flex: 1;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 11px 16px;
      border-radius: 12px;
      text-decoration: none;
      color: var(--mat-sys-on-surface-variant);
      font-size: 14px;
      font-weight: 500;
      transition: all 150ms ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface);
    }

    .nav-item--active {
      background: var(--mat-sys-primary-container) !important;
      color: var(--mat-sys-on-primary-container) !important;
      font-weight: 600;
    }

    .nav-item--active .nav-icon {
      color: var(--mat-sys-on-primary-container);
      opacity: 1;
    }

    .nav-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      opacity: 0.8;
    }

    .nav-label {
      letter-spacing: 0.1px;
    }

    .sidebar-spacer {
      flex: 1;
    }

    /* Tech Stack */
    .tech-stack {
      padding: 16px 20px 12px;
    }

    .tech-title {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--mat-sys-on-surface-variant);
      opacity: 0.5;
      margin: 0 0 10px;
    }

    .tech-chips {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tech-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
      background: var(--mat-sys-surface-container);
      border-radius: 8px;
      padding: 5px 10px;
      border: 1px solid var(--mat-sys-outline-variant);
      transition: background-color var(--app-transition-speed) ease;
    }

    .chip-icon {
      font-size: 13px;
      width: 13px;
      height: 13px;
      color: var(--mat-sys-primary);
      opacity: 0.8;
    }

    /* User Profile */
    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      cursor: default;
      position: relative;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 11px;
      color: var(--mat-sys-on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4caf50;
      box-shadow: 0 0 0 2px var(--app-sidebar-bg);
      flex-shrink: 0;
    }
  `,
})
export class SidebarComponent {
  navigated = output<void>();

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'People', route: '/employees', icon: 'people' },
    { label: 'Projects', route: '/projects', icon: 'folder_open' },
    { label: 'Time Allocation', route: '/time-allocation', icon: 'calendar_month' },
  ];
}
