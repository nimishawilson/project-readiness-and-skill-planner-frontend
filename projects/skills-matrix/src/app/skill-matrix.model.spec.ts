import { MATRIX_EMPLOYEES } from './skill-matrix.mock';
import { coverageFor, levelOf } from './skill-matrix.model';

describe('skill matrix model', () => {
  it('treats a missing skill as not assessed', () => {
    expect(levelOf(MATRIX_EMPLOYEES[5], 1)).toBe('NOT_ASSESSED');
  });

  it('counts levels per skill', () => {
    expect(coverageFor(1, MATRIX_EMPLOYEES)).toEqual({ expert: 1, intermediate: 1, beginner: 1 });
    expect(coverageFor(3, MATRIX_EMPLOYEES)).toEqual({ expert: 0, intermediate: 3, beginner: 2 });
    expect(coverageFor(6, MATRIX_EMPLOYEES)).toEqual({ expert: 1, intermediate: 0, beginner: 2 });
  });
});
