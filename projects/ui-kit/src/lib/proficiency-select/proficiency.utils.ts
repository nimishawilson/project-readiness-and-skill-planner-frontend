/** Matches the backend `ProficiencyLevel` enum, plus `NOT_ASSESSED` for "no level yet". */
export type ProficiencyValue = 'NOT_ASSESSED' | 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';

export const PROFICIENCY_OPTIONS: { value: ProficiencyValue; label: string }[] = [
  { value: 'NOT_ASSESSED', label: 'Not assessed' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'EXPERT', label: 'Expert' },
];

export const PROFICIENCY_SEGMENTS = 3;

/** Filled segments out of 3: not assessed 0, beginner 1, intermediate 2, expert 3. */
export function segmentsFor(level: ProficiencyValue): number {
  return PROFICIENCY_OPTIONS.findIndex((o) => o.value === level);
}

export function proficiencyLabel(level: ProficiencyValue): string {
  return PROFICIENCY_OPTIONS.find((o) => o.value === level)?.label ?? '';
}
