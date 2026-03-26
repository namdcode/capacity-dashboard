# Capacity Analytics Dashboard

A consulting-firm capacity management dashboard built with Angular 21, showcasing enterprise patterns: standalone components, signals, Angular Material M3, lazy-loaded routes, and interactive charts.

**Live demo:** [capacity-dashboard.web.app](https://capacity-dashboard.web.app)

## Tech Stack

- **Angular 21** — standalone components, signals, new control flow (`@if`, `@for`, `@defer`)
- **Angular Material** — M3 theming with Violet/Cyan palette
- **ngx-charts** — utilization trends, billable breakdowns, revenue, and burn rate charts
- **SCSS** — with Angular Material theme variables
- **Firebase Hosting** — automated deployment via GitHub Actions

## Features

- **Dashboard** — KPI cards with utilization rates, billable hours, and revenue metrics; trend charts with deferred loading
- **Employee Management** — filterable/sortable table with department and role filters, individual detail views with weekly hours breakdown
- **Project Tracking** — project list with budget progress bars, detail views with burn rate charts and team allocation
- **Time Allocation** — weekly heatmap grid (employees x days) with color-coded utilization and project breakdown tooltips

## Architecture Highlights

- Zero NgModules — fully standalone component architecture
- Signal-based state management with `signal()` and `computed()`
- `inject()` function pattern (no constructor DI)
- Lazy-loaded feature routes for optimal bundle splitting
- Mock HTTP interceptor and route guard (demo patterns)
- Custom pipes for display formatting (utilization, currency, hours)

## Getting Started

```bash
npm install
npx ng serve
```

Open [http://localhost:4200](http://localhost:4200).

## Build

```bash
npx ng build --configuration=production
```

## License

MIT
