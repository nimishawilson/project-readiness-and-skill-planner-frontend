/** `value` moved by `delta`, kept within `min` and `max`. */
export function stepValue(value: number, delta: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value + delta));
}
