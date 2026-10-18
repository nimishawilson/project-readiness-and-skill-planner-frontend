import { describe, expect, it } from 'vitest';
import { slotsFor } from './headcount-meter.utils';

describe('slotsFor', () => {
  it('fills slots up to the qualified count', () => {
    expect(slotsFor(1, 2)).toEqual([true, false]);
  });

  it('ignores qualified people beyond the requirement', () => {
    expect(slotsFor(5, 2)).toEqual([true, true]);
  });

  it('caps the number of slots shown', () => {
    expect(slotsFor(0, 50)).toHaveLength(8);
  });

  it('shows nothing when nobody is required', () => {
    expect(slotsFor(1, 0)).toEqual([]);
  });
});
