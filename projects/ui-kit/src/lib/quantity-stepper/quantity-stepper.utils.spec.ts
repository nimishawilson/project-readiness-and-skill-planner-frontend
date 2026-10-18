import { describe, expect, it } from 'vitest';
import { stepValue } from './quantity-stepper.utils';

describe('stepValue', () => {
  it('moves by the delta', () => {
    expect(stepValue(2, 1, 1, 10)).toBe(3);
    expect(stepValue(2, -1, 1, 10)).toBe(1);
  });

  it('stops at the bounds', () => {
    expect(stepValue(1, -1, 1, 10)).toBe(1);
    expect(stepValue(10, 1, 1, 10)).toBe(10);
  });
});
