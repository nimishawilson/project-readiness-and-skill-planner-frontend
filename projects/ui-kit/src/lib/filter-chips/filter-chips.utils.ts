/** Index to move to for a radiogroup key, or -1 if the key does not move. Arrows wrap. */
export function nextChipIndex(key: string, current: number, length: number): number {
  if (length <= 0) return -1;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % length;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + length) % length;
    case 'Home':
      return 0;
    case 'End':
      return length - 1;
    default:
      return -1;
  }
}
