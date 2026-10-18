import type { TeamGoal, TeamMember } from './learning-goals.model';

/** Static data until the API is wired. Years are relative so the screens always show a current year. */
export const CURRENT_YEAR = new Date().getFullYear();
const PREVIOUS_YEAR = CURRENT_YEAR - 1;

export const TEAM: TeamMember[] = [
  { id: 1, name: 'Arjun Mehta', title: 'Senior Software Engineer' },
  { id: 2, name: 'Kavya Reddy', title: 'Software Engineer' },
  { id: 3, name: 'Rahul Iyer', title: 'Frontend Engineer' },
  { id: 4, name: 'Sneha Kulkarni', title: 'QA Engineer' },
  { id: 5, name: 'Daniel Thomas', title: 'Backend Engineer' },
  { id: 6, name: 'Meera Pillai', title: 'Product Designer' },
];

const y = CURRENT_YEAR;
const p = PREVIOUS_YEAR;

export const GOALS: TeamGoal[] = [
  { id: 1, employeeId: 1, year: y, title: 'Complete Kubernetes for Developers (CKAD prep)', description: 'Finish the course and pass the practice exam with 75% or more.', progressStatus: 'COMPLETED', approvalStatus: 'PENDING', createdAt: `${y}-02-10` },
  { id: 2, employeeId: 1, year: y, title: 'Lead one architecture review per quarter', progressStatus: 'IN_PROGRESS', approvalStatus: 'PENDING', createdAt: `${y}-02-10` },
  { id: 3, employeeId: 1, year: y, title: 'Kafka Streams deep dive', description: 'Build the reconciliation stream prototype.', progressStatus: 'COMPLETED', approvalStatus: 'APPROVED', createdAt: `${y}-02-10` },
  { id: 4, employeeId: 2, year: y, title: 'Finish Advanced SQL course', progressStatus: 'COMPLETED', approvalStatus: 'APPROVED', createdAt: `${y}-03-02` },
  { id: 5, employeeId: 2, year: y, title: 'Write integration tests for refunds service', description: 'Reach 80% coverage on the refunds module.', progressStatus: 'IN_PROGRESS', approvalStatus: 'PENDING', createdAt: `${y}-05-12` },
  { id: 6, employeeId: 3, year: y, title: 'Complete Web Accessibility fundamentals', progressStatus: 'COMPLETED', approvalStatus: 'PENDING', createdAt: `${y}-04-01` },
  { id: 7, employeeId: 3, year: y, title: 'Ship design-token migration', description: 'Move all Payments screens to the new tokens.', progressStatus: 'COMPLETED', approvalStatus: 'PENDING', createdAt: `${y}-04-01` },
  { id: 8, employeeId: 4, year: y, title: 'Automate the regression suite with Playwright', progressStatus: 'IN_PROGRESS', approvalStatus: 'PENDING', createdAt: `${y}-03-15` },
  { id: 9, employeeId: 6, year: y, title: 'Run a usability study on onboarding', progressStatus: 'NOT_STARTED', approvalStatus: 'PENDING', createdAt: `${y}-06-03` },
  { id: 10, employeeId: 1, year: p, title: 'Get AWS Solutions Architect certified', progressStatus: 'COMPLETED', approvalStatus: 'APPROVED', createdAt: `${p}-02-01` },
  { id: 11, employeeId: 2, year: p, title: 'Mentor two junior engineers', progressStatus: 'IN_PROGRESS', approvalStatus: 'PENDING', createdAt: `${p}-02-01` },
  { id: 12, employeeId: 3, year: p, title: 'TypeScript advanced patterns', progressStatus: 'COMPLETED', approvalStatus: 'APPROVED', createdAt: `${p}-02-01` },
];
