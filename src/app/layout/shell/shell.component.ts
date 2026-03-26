import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, SidebarComponent, ToolbarComponent],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="sidenavOpen()"
        (closed)="sidenavOpen.set(false)"
        class="shell-sidenav"
      >
        <app-sidebar (navigated)="onNavigation()" />
      </mat-sidenav>

      <mat-sidenav-content class="shell-main">
        <app-toolbar
          [isMobile]="isMobile()"
          (toggleSidenav)="sidenavOpen.update((v) => !v)"
        />
        <main class="shell-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .shell {
      height: 100%;
    }

    .shell-sidenav {
      width: 272px;
      border-right: none !important;
      background: var(--app-sidebar-bg) !important;
      box-shadow: 1px 0 0 var(--mat-sys-outline-variant);
      transition: background-color var(--app-transition-speed) ease;
    }

    .shell-main {
      display: flex;
      flex-direction: column;
      background: var(--app-bg) !important;
      transition: background-color var(--app-transition-speed) ease;
    }

    .shell-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `,
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  // Start open on desktop, closed on mobile (check window width immediately)
  readonly sidenavOpen = signal(
    typeof window !== 'undefined' ? window.innerWidth > 960 : true
  );

  onNavigation(): void {
    if (this.isMobile()) {
      this.sidenavOpen.set(false);
    }
  }
}
