import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCount } from './count-badge.utils';

/**
 * Small orange circle with a number, shown next to a name (e.g. goals awaiting approval).
 * Renders nothing when the count is zero.
 */
@Component({
  selector: 'app-count-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span aria-hidden="true">{{ text() }}</span>
    <span class="sr-only">{{ text() }} {{ label() }}</span>
  `,
  styleUrl: './count-badge.scss',
  host: { '[attr.hidden]': 'text() ? null : ""' },
})
export class CountBadge {
  /** The number to show. Zero or less hides the badge. */
  readonly count = input.required<number>();
  /** Counts above this are shown as `max+`. */
  readonly max = input(99);
  /** What is counted, read by screen readers after the number (e.g. "goals awaiting approval"). */
  readonly label = input<string>();

  protected readonly text = computed(() => formatCount(this.count(), this.max()));
}
