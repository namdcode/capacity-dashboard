export type Department = 'Advisory' | 'Tax' | 'Audit' | 'Technology' | 'Operations';

export type Role =
  | 'Partner'
  | 'Director'
  | 'Senior Manager'
  | 'Manager'
  | 'Senior Consultant'
  | 'Consultant'
  | 'Analyst';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: Department;
  billableRate: number;
  targetUtilization: number;
  avatarUrl: string;
  startDate: string;
  isActive: boolean;
}
