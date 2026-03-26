import { Injectable, computed, signal } from '@angular/core';
import { Project, ProjectStatus } from '../../models';
import { MOCK_PROJECTS } from '../../mock-data';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly projects = signal<Project[]>(MOCK_PROJECTS);

  readonly all = this.projects.asReadonly();
  readonly active = computed(() =>
    this.projects().filter((p) => p.status === 'active')
  );
  readonly count = computed(() => this.projects().length);

  getById(id: string): Project | undefined {
    return this.projects().find((p) => p.id === id);
  }

  getByEmployeeId(employeeId: string): Project[] {
    return this.projects().filter((p) =>
      p.teamMemberIds.includes(employeeId)
    );
  }

  updateStatus(projectId: string, status: ProjectStatus): void {
    this.projects.update((projects) =>
      projects.map((p) =>
        p.id === projectId ? { ...p, status } : p
      )
    );
  }
}
