/** Text for a count: "" when nothing to show, "max+" above `max`. */
export function formatCount(count: number, max = 99): string {
  if (!Number.isFinite(count) || count <= 0) return '';
  return count > max ? `${max}+` : String(count);
}
