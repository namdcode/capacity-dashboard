# Capacity Analytics Dashboard

## Overview
Angular 21 demo app for consulting-firm capacity management. Showcases enterprise Angular patterns: standalone components, signals, RxJS, Angular Material, lazy-loaded routes, and custom pipes. All data is mocked — no backend or authentication required.

## Tech Stack
- **Framework:** Angular 21 (standalone components, signals, new control flow)
- **UI Library:** Angular Material (M3 theming, Violet/Cyan palette)
- **Charts:** @swimlane/ngx-charts
- **Styling:** SCSS with Angular Material theme variables
- **Hosting:** Firebase Hosting (site: `capacity-dashboard` under project `nam-portfolio-3cef6`)

## Project Structure
```
src/app/
  models/           # TypeScript interfaces (Employee, Project, TimeEntry)
  mock-data/        # Mock data + generator functions (20 employees, 8 projects, ~2400 entries)
  core/
    services/       # Injectable services with signals (employee, project, time-entry, capacity)
    interceptors/   # Mock HTTP interceptor (demo pattern)
    guards/         # Route guard (demo pattern)
  shared/
    pipes/          # Custom pipes (utilization, currency-format, hours-display)
    components/     # Reusable components (kpi-card, status-badge, page-header)
    chart-schemes.ts # ngx-charts color scheme constants
  features/
    dashboard/      # KPI cards + utilization/billable/revenue charts
    employees/      # List with filters + detail with weekly hours chart
    projects/       # List with budget bars + detail with burn rate chart
    time-allocation/ # Weekly heatmap grid (employees x days)
  layout/
    shell/          # mat-sidenav-container with responsive breakpoints
    sidebar/        # Navigation with routerLink items
    toolbar/        # Top bar with menu toggle
```

## Commands
- Dev server: `npx ng serve` (default port 4200)
- Production build: `npx ng build --configuration=production`
- Lint: `npx ng lint`
- Test: `npx ng test`

## Architecture Notes
- **Standalone components only** — zero NgModules
- **Signals for state** — services use `signal()` and `computed()`, not BehaviorSubject
- **`inject()` function** — not constructor DI
- **New control flow** — `@if`, `@for`, `@switch`, `@defer`
- **Mock data** — generated in `mock-data/generators.ts`, loaded synchronously at service init
- **Lazy-loaded routes** — each feature area uses `loadChildren` with dynamic import
- **OnPush-friendly** — all state flows through signals and computed values

## Coding Standards
- Standalone components with inline templates and styles for small components
- `input()`, `output()`, `input.required()` signal-based APIs (not @Input/@Output decorators)
- Reactive forms with `FormControl` (not template-driven)
- Custom pipes for display formatting (never format in component logic)
- Color schemes defined centrally in `shared/chart-schemes.ts`

## Deployment
- Automated via GitHub Actions on push to `main`
- Deploys to Firebase Hosting site `capacity-dashboard` under project `nam-portfolio-3cef6`
- Requires `FIREBASE_SERVICE_ACCOUNT` GitHub secret (service account JSON key)
- URL: https://capacity-dashboard.web.app

## Firebase
- Same project as portfolio (`nam-portfolio-3cef6`), separate hosting site
- No Firestore, no Auth, no Cloud Functions — pure static hosting
- Listed as FeaturedApp in portfolio's Firestore `featuredApps` collection

## Node.js
- Requires Node.js >= 20.19 (Angular CLI requirement)
- Use `nvm use 20.19` if available
