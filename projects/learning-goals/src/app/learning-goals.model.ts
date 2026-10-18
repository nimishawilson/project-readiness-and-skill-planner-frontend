import type { GoalProgress } from '@app/ui-kit';

/** Max learning goals per employee per year (spec 3.3). */
export const MAX_GOALS_PER_YEAR = 3;

export type ApprovalStatus = 'PENDING' | 'APPROVED';

export interface TeamMember {
  id: number;
  name: string;
  title: string;
}

/** Shaped like the API's learning goal (`API_ENDPOINTS.md` section 5). */
export interface TeamGoal {
  id: number;
  employeeId: number;
  title: string;
  description?: string;
  year: number;
  progressStatus: GoalProgress;
  approvalStatus: ApprovalStatus;
  /** ISO date; shown as the "assigned" date. */
  createdAt: string;
}

export interface GoalSummary {
  awaiting: number;
  inProgress: number;
  notStarted: number;
  approved: number;
}

export type TeamFilter = 'all' | 'awaiting' | 'open';

/** Completed by the employee, not yet approved by the manager. */
export function isAwaiting(goal: TeamGoal): boolean {
  return goal.progressStatus === 'COMPLETED' && goal.approvalStatus === 'PENDING';
}

export function goalsFor(goals: TeamGoal[], employeeId: number, year: number): TeamGoal[] {
  return goals.filter((g) => g.employeeId === employeeId && g.year === year);
}

export function slotsLeft(count: number): number {
  return Math.max(0, MAX_GOALS_PER_YEAR - count);
}

/** New goals can be assigned for the current or the next year only. */
export function canAssignIn(year: number, currentYear: number): boolean {
  return year === currentYear || year === currentYear + 1;
}

/** Tile counts. Approved wins over progress; awaiting is completed and not approved. */
export function summarize(goals: TeamGoal[]): GoalSummary {
  const summary: GoalSummary = { awaiting: 0, inProgress: 0, notStarted: 0, approved: 0 };
  for (const goal of goals) {
    if (goal.approvalStatus === 'APPROVED') summary.approved++;
    else if (isAwaiting(goal)) summary.awaiting++;
    else if (goal.progressStatus === 'IN_PROGRESS') summary.inProgress++;
    else if (goal.progressStatus === 'NOT_STARTED') summary.notStarted++;
  }
  return summary;
}

/** Trim and collapse whitespace, like the API's title normalisation. */
export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 1000;
