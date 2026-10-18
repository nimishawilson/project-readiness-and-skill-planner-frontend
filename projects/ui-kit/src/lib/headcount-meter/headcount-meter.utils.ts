export const MAX_SLOTS_SHOWN = 8;

/** One flag per person required (capped): true when that slot is filled by a qualified person. */
export function slotsFor(filled: number, required: number, cap = MAX_SLOTS_SHOWN): boolean[] {
  const size = Math.min(Math.max(0, Math.floor(required)), cap);
  const on = Math.max(0, Math.floor(filled));
  return Array.from({ length: size }, (_, i) => i < on);
}
