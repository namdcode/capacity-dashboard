export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'at-risk';

export interface Project {
  id: string;
  name: string;
  client: string;
  code: string;
  budgetHours: number;
  budgetAmount: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  managerId: string;
  teamMemberIds: string[];
}
