import { describe, expect, it } from 'vitest';
import { initialsFrom } from './avatar.utils';

describe('initialsFrom', () => {
  it('uses the first letter of the first and last word', () => {
    expect(initialsFrom('Arjun Mehta')).toBe('AM');
    expect(initialsFrom('Mary Jane Watson')).toBe('MW');
  });

  it('gives one letter for a single word', () => {
    expect(initialsFrom('Madonna')).toBe('M');
  });

  it('ignores extra whitespace and upper-cases', () => {
    expect(initialsFrom('  priya   nair ')).toBe('PN');
  });

  it('returns "?" for empty or blank names', () => {
    expect(initialsFrom('')).toBe('?');
    expect(initialsFrom('   ')).toBe('?');
  });
});
