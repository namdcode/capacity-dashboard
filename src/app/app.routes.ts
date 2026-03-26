import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          ),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./features/employees/employees.routes').then(
            (m) => m.EMPLOYEE_ROUTES
          ),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then(
            (m) => m.PROJECT_ROUTES
          ),
      },
      {
        path: 'time-allocation',
        loadChildren: () =>
          import('./features/time-allocation/time-allocation.routes').then(
            (m) => m.TIME_ALLOCATION_ROUTES
          ),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
