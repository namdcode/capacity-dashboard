import { Employee } from '../models';

export const MOCK_EMPLOYEES: Employee[] = [
  // Partners
  {
    id: 'emp-001', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@firm.lu',
    role: 'Partner', department: 'Advisory', billableRate: 450, targetUtilization: 0.45,
    avatarUrl: '', startDate: '2015-03-01', isActive: true,
  },
  {
    id: 'emp-002', firstName: 'Lucas', lastName: 'Weber', email: 'lucas.weber@firm.lu',
    role: 'Partner', department: 'Tax', billableRate: 420, targetUtilization: 0.45,
    avatarUrl: '', startDate: '2016-01-15', isActive: true,
  },
  // Directors
  {
    id: 'emp-003', firstName: 'Emma', lastName: 'Schmitt', email: 'emma.schmitt@firm.lu',
    role: 'Director', department: 'Advisory', billableRate: 350, targetUtilization: 0.55,
    avatarUrl: '', startDate: '2017-06-15', isActive: true,
  },
  {
    id: 'emp-004', firstName: 'Thomas', lastName: 'Muller', email: 'thomas.muller@firm.lu',
    role: 'Director', department: 'Audit', billableRate: 340, targetUtilization: 0.55,
    avatarUrl: '', startDate: '2017-09-01', isActive: true,
  },
  // Senior Managers
  {
    id: 'emp-005', firstName: 'Léa', lastName: 'Dupont', email: 'lea.dupont@firm.lu',
    role: 'Senior Manager', department: 'Technology', billableRate: 280, targetUtilization: 0.70,
    avatarUrl: '', startDate: '2018-04-01', isActive: true,
  },
  {
    id: 'emp-006', firstName: 'Marc', lastName: 'Hoffmann', email: 'marc.hoffmann@firm.lu',
    role: 'Senior Manager', department: 'Advisory', billableRate: 270, targetUtilization: 0.70,
    avatarUrl: '', startDate: '2018-07-01', isActive: true,
  },
  {
    id: 'emp-007', firstName: 'Clara', lastName: 'Fischer', email: 'clara.fischer@firm.lu',
    role: 'Senior Manager', department: 'Tax', billableRate: 265, targetUtilization: 0.70,
    avatarUrl: '', startDate: '2018-11-01', isActive: true,
  },
  // Managers
  {
    id: 'emp-008', firstName: 'Antoine', lastName: 'Bernard', email: 'antoine.bernard@firm.lu',
    role: 'Manager', department: 'Technology', billableRate: 220, targetUtilization: 0.80,
    avatarUrl: '', startDate: '2019-03-01', isActive: true,
  },
  {
    id: 'emp-009', firstName: 'Julia', lastName: 'Klein', email: 'julia.klein@firm.lu',
    role: 'Manager', department: 'Audit', billableRate: 210, targetUtilization: 0.80,
    avatarUrl: '', startDate: '2019-06-01', isActive: true,
  },
  {
    id: 'emp-010', firstName: 'Isabelle', lastName: 'Simon', email: 'isabelle.simon@firm.lu',
    role: 'Manager', department: 'Operations', billableRate: 200, targetUtilization: 0.75,
    avatarUrl: '', startDate: '2019-01-15', isActive: true,
  },
  // Senior Consultants
  {
    id: 'emp-011', firstName: 'Pierre', lastName: 'Laurent', email: 'pierre.laurent@firm.lu',
    role: 'Senior Consultant', department: 'Advisory', billableRate: 175, targetUtilization: 0.85,
    avatarUrl: '', startDate: '2020-01-15', isActive: true,
  },
  {
    id: 'emp-012', firstName: 'Marie', lastName: 'Schneider', email: 'marie.schneider@firm.lu',
    role: 'Senior Consultant', department: 'Technology', billableRate: 180, targetUtilization: 0.85,
    avatarUrl: '', startDate: '2020-03-01', isActive: true,
  },
  {
    id: 'emp-013', firstName: 'Maxime', lastName: 'Braun', email: 'maxime.braun@firm.lu',
    role: 'Senior Consultant', department: 'Operations', billableRate: 165, targetUtilization: 0.85,
    avatarUrl: '', startDate: '2020-09-01', isActive: true,
  },
  {
    id: 'emp-014', firstName: 'David', lastName: 'Reuter', email: 'david.reuter@firm.lu',
    role: 'Senior Consultant', department: 'Audit', billableRate: 170, targetUtilization: 0.85,
    avatarUrl: '', startDate: '2020-06-01', isActive: true,
  },
  // Consultants
  {
    id: 'emp-015', firstName: 'Camille', lastName: 'Becker', email: 'camille.becker@firm.lu',
    role: 'Consultant', department: 'Advisory', billableRate: 140, targetUtilization: 0.90,
    avatarUrl: '', startDate: '2021-09-01', isActive: true,
  },
  {
    id: 'emp-016', firstName: 'François', lastName: 'Leclercq', email: 'francois.leclercq@firm.lu',
    role: 'Consultant', department: 'Tax', billableRate: 135, targetUtilization: 0.90,
    avatarUrl: '', startDate: '2022-01-15', isActive: true,
  },
  {
    id: 'emp-017', firstName: 'Aline', lastName: 'Wagner', email: 'aline.wagner@firm.lu',
    role: 'Consultant', department: 'Technology', billableRate: 145, targetUtilization: 0.90,
    avatarUrl: '', startDate: '2022-03-01', isActive: true,
  },
  {
    id: 'emp-018', firstName: 'Hugo', lastName: 'Roth', email: 'hugo.roth@firm.lu',
    role: 'Consultant', department: 'Operations', billableRate: 130, targetUtilization: 0.90,
    avatarUrl: '', startDate: '2022-06-01', isActive: true,
  },
  // Analysts
  {
    id: 'emp-019', firstName: 'Nicolas', lastName: 'Meyer', email: 'nicolas.meyer@firm.lu',
    role: 'Analyst', department: 'Advisory', billableRate: 110, targetUtilization: 0.92,
    avatarUrl: '', startDate: '2023-09-01', isActive: true,
  },
  {
    id: 'emp-020', firstName: 'Sarah', lastName: 'Keller', email: 'sarah.keller@firm.lu',
    role: 'Analyst', department: 'Technology', billableRate: 115, targetUtilization: 0.92,
    avatarUrl: '', startDate: '2023-09-01', isActive: true,
  },
  {
    id: 'emp-021', firstName: 'Julien', lastName: 'Roth', email: 'julien.roth@firm.lu',
    role: 'Analyst', department: 'Tax', billableRate: 105, targetUtilization: 0.92,
    avatarUrl: '', startDate: '2024-01-15', isActive: true,
  },
  {
    id: 'emp-022', firstName: 'Chloé', lastName: 'Weiss', email: 'chloe.weiss@firm.lu',
    role: 'Analyst', department: 'Audit', billableRate: 105, targetUtilization: 0.92,
    avatarUrl: '', startDate: '2024-06-01', isActive: true,
  },
  // Inactive / On leave
  {
    id: 'emp-023', firstName: 'Laurent', lastName: 'Maas', email: 'laurent.maas@firm.lu',
    role: 'Senior Consultant', department: 'Tax', billableRate: 175, targetUtilization: 0.85,
    avatarUrl: '', startDate: '2019-02-01', isActive: false,
  },
  {
    id: 'emp-024', firstName: 'Elise', lastName: 'Thill', email: 'elise.thill@firm.lu',
    role: 'Manager', department: 'Advisory', billableRate: 215, targetUtilization: 0.80,
    avatarUrl: '', startDate: '2018-10-01', isActive: false,
  },
];
