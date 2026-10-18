import { proficiencyLabel, segmentsFor, type ProficiencyValue } from '@app/ui-kit';

/** Lowest level a requirement can ask for. `NOT_ASSESSED` is never a valid minimum. */
export type MinLevel = Exclude<ProficiencyValue, 'NOT_ASSESSED'>;

export type ReadinessStatus = 'READY' | 'NOT_READY';

export interface Skill {
  id: number;
  name: string;
}

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  /** Level per skill id; a missing skill means not assessed. */
  levels: Record<number, ProficiencyValue>;
}

export interface Requirement {
  id: number;
  skillId: number;
  minLevel: MinLevel;
  peopleRequired: number;
}

/** A project's data for one year. Shaped like the API's per-year readiness and assignments. */
export interface ProjectYear {
  year: number;
  requirements: Requirement[];
  assignedIds: number[];
  /** Set when this year was created by mapping from an earlier one. */
  carriedFromYear?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdYear: number;
  years: ProjectYear[];
}

export interface RequirementStatus {
  requirement: Requirement;
  qualifiedAssigned: number;
  additionalNeeded: number;
}

export interface Readiness {
  status: ReadinessStatus;
  rows: RequirementStatus[];
  /** Sum of `additionalNeeded`. */
  totalNeeded: number;
  /** Requirements with nobody more needed. */
  metCount: number;
}

/** One project as seen in one year: its data, who is assigned and the readiness computed from both. */
export interface ProjectView {
  project: Project;
  year: ProjectYear;
  assignees: TeamMember[];
  readiness: Readiness;
}

export type ProjectFilter = 'all' | 'ready' | 'notReady';

export const NAME_MAX = 100;
export const DESCRIPTION_MAX = 1000;
export const PEOPLE_MAX = 1000;
/** How many years past the current one the map-year dialog offers. */
export const MAP_YEAR_HORIZON = 3;

export function levelOf(member: TeamMember, skillId: number): ProficiencyValue {
  return member.levels[skillId] ?? 'NOT_ASSESSED';
}

/** At or above the minimum. Not assessed never qualifies, since a minimum is at least Beginner. */
export function meetsLevel(level: ProficiencyValue, min: MinLevel): boolean {
  return segmentsFor(level) >= segmentsFor(min);
}

export function qualifies(member: TeamMember, requirement: Requirement): boolean {
  return meetsLevel(levelOf(member, requirement.skillId), requirement.minLevel);
}

/**
 * Per requirement: `additionalNeeded = max(0, required - qualifiedAssigned)`. Ready only if every
 * requirement needs nobody more. One person counts toward every requirement they qualify for.
 * No requirements means ready.
 */
export function computeReadiness(requirements: Requirement[], assignees: TeamMember[]): Readiness {
  const rows = requirements.map((requirement) => {
    const qualifiedAssigned = assignees.filter((m) => qualifies(m, requirement)).length;
    return {
      requirement,
      qualifiedAssigned,
      additionalNeeded: Math.max(0, requirement.peopleRequired - qualifiedAssigned),
    };
  });
  const totalNeeded = rows.reduce((sum, r) => sum + r.additionalNeeded, 0);
  return {
    status: totalNeeded === 0 ? 'READY' : 'NOT_READY',
    rows,
    totalNeeded,
    metCount: rows.filter((r) => r.additionalNeeded === 0).length,
  };
}

/** The same skill may repeat at different levels; the same skill and level may not. */
export function isDuplicateRequirement(requirements: Requirement[], skillId: number, minLevel: MinLevel): boolean {
  return requirements.some((r) => r.skillId === skillId && r.minLevel === minLevel);
}

export function projectView(project: Project, year: number, team: TeamMember[]): ProjectView | undefined {
  const projectYear = yearOf(project, year);
  if (!projectYear) return undefined;
  const assignees = projectYear.assignedIds.flatMap((id) => team.find((m) => m.id === id) ?? []);
  return { project, year: projectYear, assignees, readiness: computeReadiness(projectYear.requirements, assignees) };
}

export function yearOf(project: Project, year: number): ProjectYear | undefined {
  return project.years.find((y) => y.year === year);
}

export function latestYear(project: Project): ProjectYear {
  return project.years.reduce((latest, y) => (y.year > latest.year ? y : latest));
}

/** Years a project can be mapped to: not before the current year, after its latest year, within the horizon. */
export function mappableYears(project: Project, currentYear: number): number[] {
  const latest = latestYear(project).year;
  const first = Math.max(currentYear, latest + 1);
  const last = currentYear + MAP_YEAR_HORIZON;
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => first + i);
}

/** The new year's data: the latest year's requirements and assignments, copied. */
export function carryForward(source: ProjectYear, year: number): ProjectYear {
  return {
    year,
    requirements: source.requirements.map((r) => ({ ...r })),
    assignedIds: [...source.assignedIds],
    carriedFromYear: source.year,
  };
}

/** Unmet requirements this person would help close, e.g. for the "Would cover" hint. */
export function wouldCover(member: TeamMember, rows: RequirementStatus[]): Requirement[] {
  return rows.filter((r) => r.additionalNeeded > 0 && qualifies(member, r.requirement)).map((r) => r.requirement);
}

/** Skills where this person meets a requirement, once per skill, at their own level. */
export function metSkills(member: TeamMember, requirements: Requirement[]): { skillId: number; level: ProficiencyValue }[] {
  const seen = new Set<number>();
  const result: { skillId: number; level: ProficiencyValue }[] = [];
  for (const requirement of requirements) {
    if (seen.has(requirement.skillId) || !qualifies(member, requirement)) continue;
    seen.add(requirement.skillId);
    result.push({ skillId: requirement.skillId, level: levelOf(member, requirement.skillId) });
  }
  return result;
}

/** Other projects this person is on in `year`. */
export function otherProjectCount(employeeId: number, projects: Project[], year: number, excludeProjectId?: number): number {
  return projects.filter((p) => p.id !== excludeProjectId && yearOf(p, year)?.assignedIds.includes(employeeId)).length;
}

/** "Java Intermediate+" */
export function requirementLabel(requirement: Requirement, skills: Skill[]): string {
  const name = skills.find((s) => s.id === requirement.skillId)?.name ?? 'Unknown skill';
  return `${name} ${proficiencyLabel(requirement.minLevel)}+`;
}

/** "Java Intermediate+ (1), SQL Intermediate+ (2)" for the requirements still needing people. */
export function describeNeeds(rows: RequirementStatus[], skills: Skill[]): string {
  return rows
    .filter((r) => r.additionalNeeded > 0)
    .map((r) => `${requirementLabel(r.requirement, skills)} (${r.additionalNeeded})`)
    .join(', ');
}

/** Trim and collapse whitespace, like the API's name normalisation. */
export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}
