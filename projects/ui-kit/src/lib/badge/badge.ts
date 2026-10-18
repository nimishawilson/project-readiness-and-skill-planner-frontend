import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'neutral';
export type BadgeEmphasis = 'soft' | 'solid' | 'outline';

/**
 * Small pill for a short status or label. The text (and an optional leading icon,
 * which should be `aria-hidden`) is projected as content.
 */
@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './badge.scss',
  host: { '[class]': '"app-badge--" + variant() + " app-badge--" + emphasis()' },
})
export class Badge {
  /** Meaning: `success` (ready, approved), `warning` (not ready, needed) or `neutral`. */
  readonly variant = input<BadgeVariant>('neutral');
  /** `soft` is a light tint with a thin border; `solid` is a filled pill. */
  readonly emphasis = input<BadgeEmphasis>('soft');
}
