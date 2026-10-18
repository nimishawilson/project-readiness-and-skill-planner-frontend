import { describe, expect, it } from 'vitest';
import { proficiencyLabel, segmentsFor } from './proficiency.utils';

describe('proficiency utils', () => {
  it('maps each level to filled segments', () => {
    expect(segmentsFor('NOT_ASSESSED')).toBe(0);
    expect(segmentsFor('BEGINNER')).toBe(1);
    expect(segmentsFor('INTERMEDIATE')).toBe(2);
    expect(segmentsFor('EXPERT')).toBe(3);
  });

  it('returns the display label', () => {
    expect(proficiencyLabel('NOT_ASSESSED')).toBe('Not assessed');
    expect(proficiencyLabel('EXPERT')).toBe('Expert');
  });
});
