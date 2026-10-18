import { describe, expect, it } from 'vitest';
import { dotsFor } from './progress-dots.utils';

describe('dotsFor', () => {
  it('fills the first n dots', () => {
    expect(dotsFor(2, 3)).toEqual([true, true, false]);
  });

  it('clamps out-of-range counts', () => {
    expect(dotsFor(5, 3)).toEqual([true, true, true]);
    expect(dotsFor(-1, 3)).toEqual([false, false, false]);
  });

  it('returns nothing for a non-positive total', () => {
    expect(dotsFor(1, 0)).toEqual([]);
  });
});
