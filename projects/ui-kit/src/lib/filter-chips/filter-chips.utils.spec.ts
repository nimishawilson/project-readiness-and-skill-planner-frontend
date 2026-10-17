import { describe, expect, it } from 'vitest';
import { nextChipIndex } from './filter-chips.utils';

describe('nextChipIndex', () => {
  it('moves forward and wraps', () => {
    expect(nextChipIndex('ArrowRight', 0, 3)).toBe(1);
    expect(nextChipIndex('ArrowDown', 2, 3)).toBe(0);
  });

  it('moves back and wraps', () => {
    expect(nextChipIndex('ArrowLeft', 1, 3)).toBe(0);
    expect(nextChipIndex('ArrowUp', 0, 3)).toBe(2);
  });

  it('jumps to the ends', () => {
    expect(nextChipIndex('Home', 2, 4)).toBe(0);
    expect(nextChipIndex('End', 0, 4)).toBe(3);
  });

  it('ignores other keys and empty lists', () => {
    expect(nextChipIndex('a', 0, 3)).toBe(-1);
    expect(nextChipIndex('ArrowRight', 0, 0)).toBe(-1);
  });
});
