import type { ProficiencyValue } from '@app/ui-kit';

export interface MatrixSkill {
  id: number;
  name: string;
}

export interface MatrixEmployee {
  id: number;
  name: string;
  title: string;
  /** Level per skill id. A missing skill means not assessed. */
  levels: Record<number, ProficiencyValue>;
}

export interface Coverage {
  expert: number;
  intermediate: number;
  beginner: number;
}

export function levelOf(employee: MatrixEmployee, skillId: number): ProficiencyValue {
  return employee.levels[skillId] ?? 'NOT_ASSESSED';
}

/** How many people are Expert, Intermediate and Beginner in one skill. */
export function coverageFor(skillId: number, employees: MatrixEmployee[]): Coverage {
  const count = (level: ProficiencyValue) => employees.filter((e) => levelOf(e, skillId) === level).length;
  return { expert: count('EXPERT'), intermediate: count('INTERMEDIATE'), beginner: count('BEGINNER') };
}
