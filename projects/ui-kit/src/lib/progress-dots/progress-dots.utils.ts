/** Fill flags for `total` dots with `filled` of them on. Out-of-range input is clamped. */
export function dotsFor(filled: number, total: number): boolean[] {
  const size = Math.max(0, Math.floor(total));
  const on = Math.min(Math.max(0, Math.floor(filled)), size);
  return Array.from({ length: size }, (_, i) => i < on);
}
