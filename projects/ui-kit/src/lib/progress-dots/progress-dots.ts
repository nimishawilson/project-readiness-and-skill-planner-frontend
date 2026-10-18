import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { dotsFor } from './progress-dots.utils';

/** A row of small pills showing how many of `total` slots are used (e.g. goals 2 of 3). */
@Component({
  selector: 'app-progress-dots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (on of dots(); track $index) {
      <span [class.on]="on"></span>
    }
  `,
  styleUrl: './progress-dots.scss',
  host: { role: 'img', '[attr.aria-label]': 'label()' },
})
export class ProgressDots {
  readonly filled = input.required<number>();
  readonly total = input(3);
  /** Accessible text, e.g. "2 of 3 goals". */
  readonly label = input.required<string>();

  protected readonly dots = computed(() => dotsFor(this.filled(), this.total()));
}
