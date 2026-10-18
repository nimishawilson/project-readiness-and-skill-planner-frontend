import type { GoalProgress, ProficiencyValue } from '@app/ui-kit';

export interface EmployeeSkill {
  name: string;
  level: ProficiencyValue;
}

export interface EmployeeGoal {
  id: number;
  title: string;
  /** ISO date. */
  targetDate: string;
  completedDate?: string;
  progress: GoalProgress;
  approved: boolean;
}

export interface Employee {
  id: number;
  name: string;
  title: string;
  department: string;
  /** On the signed-in manager's team: editable. Otherwise view only. */
  isMyTeam: boolean;
  employeeCode: string;
  email: string;
  location: string;
  /** ISO date. */
  joined: string;
  reportsTo: string;
  team: string;
  skills: EmployeeSkill[];
  goals: EmployeeGoal[];
}

/** Completed goals the manager still has to approve. */
export function awaitingApproval(employee: Employee): number {
  return employee.goals.filter((g) => g.progress === 'COMPLETED' && !g.approved).length;
}
