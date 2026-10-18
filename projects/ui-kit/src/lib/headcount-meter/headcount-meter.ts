import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { slotsFor } from './headcount-meter.utils';

/** Squares for people required (filled = qualified, dashed = still missing) and "1 of 2" text. */
@Component({
  selector: 'app-headcount-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="slots" aria-hidden="true">
      @for (on of slots(); track $index) {
        <span [class.on]="on"></span>
      }
    </span>
    <span class="text">{{ filled() }} of {{ required() }}</span>
  `,
  styleUrl: './headcount-meter.scss',
  host: { role: 'img', '[attr.aria-label]': 'filled() + " of " + required() + " qualified people"' },
})
export class HeadcountMeter {
  /** Qualified people assigned. */
  readonly filled = input.required<number>();
  /** People required. */
  readonly required = input.required<number>();

  protected readonly slots = computed(() => slotsFor(this.filled(), this.required()));
}
