import { describe, expect, it } from 'vitest';
import {
  canAssignIn,
  goalsFor,
  isAwaiting,
  normalizeText,
  slotsLeft,
  summarize,
  type TeamGoal,
} from './learning-goals.model';

function goal(over: Partial<TeamGoal>): TeamGoal {
  return {
    id: 1,
    employeeId: 1,
    title: 'g',
    year: 2026,
    progressStatus: 'NOT_STARTED',
    approvalStatus: 'PENDING',
    createdAt: '2026-01-01',
    ...over,
  };
}

describe('learning goals model', () => {
  it('flags completed, unapproved goals as awaiting', () => {
    expect(isAwaiting(goal({ progressStatus: 'COMPLETED' }))).toBe(true);
    expect(isAwaiting(goal({ progressStatus: 'COMPLETED', approvalStatus: 'APPROVED' }))).toBe(false);
    expect(isAwaiting(goal({ progressStatus: 'IN_PROGRESS' }))).toBe(false);
  });

  it('filters by employee and year', () => {
    const goals = [goal({ id: 1 }), goal({ id: 2, year: 2025 }), goal({ id: 3, employeeId: 2 })];
    expect(goalsFor(goals, 1, 2026).map((g) => g.id)).toEqual([1]);
  });

  it('counts open slots, never below zero', () => {
    expect(slotsLeft(1)).toBe(2);
    expect(slotsLeft(5)).toBe(0);
  });

  it('allows assigning for the current and next year only', () => {
    expect(canAssignIn(2026, 2026)).toBe(true);
    expect(canAssignIn(2027, 2026)).toBe(true);
    expect(canAssignIn(2025, 2026)).toBe(false);
    expect(canAssignIn(2028, 2026)).toBe(false);
  });

  it('summarises each goal into exactly one bucket', () => {
    const summary = summarize([
      goal({ progressStatus: 'COMPLETED' }),
      goal({ progressStatus: 'COMPLETED', approvalStatus: 'APPROVED' }),
      goal({ progressStatus: 'IN_PROGRESS' }),
      goal({ progressStatus: 'NOT_STARTED' }),
    ]);
    expect(summary).toEqual({ awaiting: 1, inProgress: 1, notStarted: 1, approved: 1 });
  });

  it('normalises whitespace', () => {
    expect(normalizeText('  Learn   Rust \n now ')).toBe('Learn Rust now');
  });
});
