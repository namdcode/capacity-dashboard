import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { hasDataGuard } from '../../core/guards/has-data.guard';

export const EMPLOYEE_ROUTES: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: ':id', component: EmployeeDetailComponent, canActivate: [hasDataGuard] },
];
