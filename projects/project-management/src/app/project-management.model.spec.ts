import { describe, expect, it } from 'vitest';
import {
  carryForward,
  computeReadiness,
  describeNeeds,
  isDuplicateRequirement,
  mappableYears,
  meetsLevel,
  metSkills,
  otherProjectCount,
  requirementLabel,
  wouldCover,
  type Project,
  type Requirement,
  type TeamMember,
} from './project-management.model';
import { SKILLS } from './project-management.mock';

function member(id: number, levels: TeamMember['levels']): TeamMember {
  return { id, name: `M${id}`, title: 't', levels };
}

function req(id: number, skillId: number, minLevel: Requirement['minLevel'], peopleRequired: number): Requirement {
  return { id, skillId, minLevel, peopleRequired };
}

function project(id: number, years: Project['years']): Project {
  return { id, name: `P${id}`, createdYear: years[0].year, years };
}

describe('project management model', () => {
  it('qualifies at or above the minimum, never when not assessed', () => {
    expect(meetsLevel('EXPERT', 'INTERMEDIATE')).toBe(true);
    expect(meetsLevel('INTERMEDIATE', 'INTERMEDIATE')).toBe(true);
    expect(meetsLevel('BEGINNER', 'INTERMEDIATE')).toBe(false);
    expect(meetsLevel('NOT_ASSESSED', 'BEGINNER')).toBe(false);
  });

  it('computes the spec example: Angular Beginner x2 with one qualified, Java Intermediate x1 covered', () => {
    const readiness = computeReadiness(
      [req(1, 1, 'BEGINNER', 2), req(2, 4, 'INTERMEDIATE', 1)],
      [member(1, { 1: 'BEGINNER', 4: 'EXPERT' }), member(2, {})],
    );
    expect(readiness.rows.map((r) => r.additionalNeeded)).toEqual([1, 0]);
    expect(readiness.status).toBe('NOT_READY');
    expect(readiness.totalNeeded).toBe(1);
    expect(readiness.metCount).toBe(1);
  });

  it('is ready with no requirements', () => {
    expect(computeReadiness([], []).status).toBe('READY');
  });

  it('counts one person toward every requirement they qualify for', () => {
    const readiness = computeReadiness([req(1, 1, 'BEGINNER', 1), req(2, 2, 'BEGINNER', 1)], [member(1, { 1: 'EXPERT', 2: 'EXPERT' })]);
    expect(readiness.status).toBe('READY');
  });

  it('never goes below zero when over-staffed', () => {
    const readiness = computeReadiness([req(1, 1, 'BEGINNER', 1)], [member(1, { 1: 'EXPERT' }), member(2, { 1: 'EXPERT' })]);
    expect(readiness.rows[0].additionalNeeded).toBe(0);
  });

  it('detects duplicate skill and level but allows the same skill at another level', () => {
    const list = [req(1, 4, 'INTERMEDIATE', 1)];
    expect(isDuplicateRequirement(list, 4, 'INTERMEDIATE')).toBe(true);
    expect(isDuplicateRequirement(list, 4, 'EXPERT')).toBe(false);
  });

  it('offers years after the latest mapped year, not before the current year', () => {
    const p = project(1, [{ year: 2026, requirements: [], assignedIds: [] }]);
    expect(mappableYears(p, 2026)).toEqual([2027, 2028, 2029]);
    const old = project(2, [{ year: 2024, requirements: [], assignedIds: [] }]);
    expect(mappableYears(old, 2026)).toEqual([2026, 2027, 2028, 2029]);
    const far = project(3, [{ year: 2029, requirements: [], assignedIds: [] }]);
    expect(mappableYears(far, 2026)).toEqual([]);
  });

  it('carries requirements and assignments forward as copies', () => {
    const source = { year: 2026, requirements: [req(1, 1, 'EXPERT', 1)], assignedIds: [1, 2] };
    const next = carryForward(source, 2027);
    expect(next).toEqual({ year: 2027, requirements: source.requirements, assignedIds: [1, 2], carriedFromYear: 2026 });
    expect(next.requirements[0]).not.toBe(source.requirements[0]);
    expect(next.assignedIds).not.toBe(source.assignedIds);
  });

  it('finds unmet requirements a person would cover', () => {
    const readiness = computeReadiness([req(1, 4, 'INTERMEDIATE', 2), req(2, 3, 'EXPERT', 1)], [member(1, { 4: 'EXPERT', 3: 'EXPERT' })]);
    const candidate = member(2, { 4: 'INTERMEDIATE', 3: 'BEGINNER' });
    expect(wouldCover(candidate, readiness.rows).map((r) => r.id)).toEqual([1]);
  });

  it('lists each met skill once at the person\'s own level', () => {
    const list = [req(1, 4, 'BEGINNER', 1), req(2, 4, 'INTERMEDIATE', 1), req(3, 3, 'EXPERT', 1)];
    expect(metSkills(member(1, { 4: 'EXPERT', 3: 'BEGINNER' }), list)).toEqual([{ skillId: 4, level: 'EXPERT' }]);
  });

  it('counts other projects in the same year only', () => {
    const projects = [
      project(1, [{ year: 2026, requirements: [], assignedIds: [1] }]),
      project(2, [{ year: 2026, requirements: [], assignedIds: [1] }]),
      project(3, [{ year: 2025, requirements: [], assignedIds: [1] }]),
    ];
    expect(otherProjectCount(1, projects, 2026, 1)).toBe(1);
  });

  it('describes needs for the callout', () => {
    const readiness = computeReadiness([req(1, 4, 'INTERMEDIATE', 2), req(2, 3, 'EXPERT', 1)], []);
    expect(describeNeeds(readiness.rows, SKILLS)).toBe('Java Intermediate+ (2), SQL Expert+ (1)');
    expect(requirementLabel(req(1, 4, 'BEGINNER', 1), SKILLS)).toBe('Java Beginner+');
  });
});
