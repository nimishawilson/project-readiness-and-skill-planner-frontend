import { describe, expect, it } from 'vitest';
import { formatCount } from './count-badge.utils';

describe('formatCount', () => {
  it('shows the number up to max', () => {
    expect(formatCount(1)).toBe('1');
    expect(formatCount(9)).toBe('9');
    expect(formatCount(99)).toBe('99');
  });

  it('caps above max', () => {
    expect(formatCount(100)).toBe('99+');
    expect(formatCount(12, 9)).toBe('9+');
  });

  it('is empty for zero, negative and non-finite counts', () => {
    expect(formatCount(0)).toBe('');
    expect(formatCount(-3)).toBe('');
    expect(formatCount(NaN)).toBe('');
  });
});
