import { Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { hasDataGuard } from '../../core/guards/has-data.guard';

export const PROJECT_ROUTES: Routes = [
  { path: '', component: ProjectListComponent },
  { path: ':id', component: ProjectDetailComponent, canActivate: [hasDataGuard] },
];
