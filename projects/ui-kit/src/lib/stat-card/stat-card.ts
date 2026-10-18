import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatCardVariant = 'warning' | 'accent' | 'neutral' | 'primary' | 'ink' | 'attention';

/**
 * Summary tile: a coloured dot, a large number and a label (e.g. "3 Awaiting approval").
 * Display only; use filter chips for anything clickable.
 */
@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="dot" aria-hidden="true"></span>
    <span class="text">
      <span class="value">{{ value() }}</span>
      <span class="label">{{ label() }}</span>
    </span>
  `,
  styleUrl: './stat-card.scss',
  host: { '[class]': '"app-stat-card--" + variant()' },
})
export class StatCard {
  /** The figure to show. Use a string such as `—` for a placeholder. */
  readonly value = input.required<number | string>();
  /** What is counted, e.g. "Awaiting approval". */
  readonly label = input.required<string>();
  /**
   * Dot colour: `warning` (needs attention), `accent` (in progress), `neutral` (not started, hollow),
   * `primary` (done), `ink` (a plain total) or `attention` (hollow warning ring, e.g. people still needed).
   */
  readonly variant = input<StatCardVariant>('neutral');
}
