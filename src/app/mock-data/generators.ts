import { TimeEntry } from '../models';
import { MOCK_EMPLOYEES } from './employees.mock';
import { MOCK_PROJECTS } from './projects.mock';

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Seeded random for deterministic data within a session
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const DESCRIPTIONS = [
  'Client workshop preparation',
  'Stakeholder alignment meeting',
  'Data analysis and reporting',
  'Documentation review',
  'Sprint planning & retrospective',
  'Code review and testing',
  'Architecture design session',
  'Risk assessment workshop',
  'Internal training session',
  'Compliance review',
  'Project status update',
  'Requirements gathering',
  'Technical implementation',
  'Quality assurance review',
  'Process improvement analysis',
  'Client presentation prep',
  'Deliverable drafting',
  'Team standup & coordination',
  'Research & benchmarking',
  'Scope definition workshop',
  'Migration planning',
  'Security audit checklist',
  'Model validation & testing',
  'Change management planning',
  'Executive briefing preparation',
  'Vendor evaluation call',
  'UAT test execution',
  'Knowledge transfer session',
  'Board report drafting',
  'Regulatory filing preparation',
];

export function generateTimeEntries(): TimeEntry[] {
  const entries: TimeEntry[] = [];
  let entryId = 1;

  const now = new Date();
  // Generate 6 months of history up to today
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Use a seed based on the current day so data is stable within a day
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rand = seededRandom(daySeed);

  for (const employee of MOCK_EMPLOYEES) {
    if (!employee.isActive) continue;

    const assignedProjects = MOCK_PROJECTS.filter((p) =>
      p.teamMemberIds.includes(employee.id)
    );

    if (assignedProjects.length === 0) continue;

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (!isWeekday(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Filter to projects active during this date
      const dateStr = formatDate(currentDate);
      const activeProjects = assignedProjects.filter(
        (p) => p.startDate <= dateStr && p.endDate >= dateStr && p.status !== 'on-hold'
      );

      if (activeProjects.length === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // Skip ~5% of days to simulate PTO/sick days
      if (rand() < 0.05) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const dailyHours = randomBetween(7, 9);
      const projectCount = Math.min(
        activeProjects.length,
        rand() < 0.6 ? 1 : 2
      );

      const dayProjects = [...activeProjects]
        .sort(() => rand() - 0.5)
        .slice(0, projectCount);

      let remainingHours = dailyHours;

      for (let i = 0; i < dayProjects.length; i++) {
        const project = dayProjects[i];
        const isLast = i === dayProjects.length - 1;
        const hours = isLast
          ? Math.round(remainingHours * 100) / 100
          : Math.round(randomBetween(2, remainingHours - 1) * 100) / 100;

        remainingHours -= hours;

        if (hours <= 0) continue;

        // Billable rate based on role
        const isBillable =
          employee.role === 'Partner'
            ? rand() < 0.5
            : rand() < 0.82;

        entries.push({
          id: `te-${String(entryId++).padStart(5, '0')}`,
          employeeId: employee.id,
          projectId: project.id,
          date: dateStr,
          hours,
          isBillable,
          description:
            DESCRIPTIONS[Math.floor(rand() * DESCRIPTIONS.length)],
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return entries;
}
