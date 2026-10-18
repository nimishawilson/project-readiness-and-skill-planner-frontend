import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Segmented bar and caption showing how many people are Expert, Intermediate and Beginner at
 * something. The bar is scaled to `total` (default: the three counts added up), so people who are
 * not assessed leave an empty stretch.
 */
@Component({
  selector: 'app-coverage-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="bar" aria-hidden="true">
      <span class="expert" [style.flex-grow]="expert()"></span>
      <span class="intermediate" [style.flex-grow]="intermediate()"></span>
      <span class="beginner" [style.flex-grow]="beginner()"></span>
      <span class="rest" [style.flex-grow]="rest()"></span>
    </span>
    <span class="caption" aria-hidden="true">{{ expert() }} Exp · {{ intermediate() }} Int · {{ beginner() }} Beg</span>
  `,
  styleUrl: './coverage-bar.scss',
  host: { role: 'img', '[attr.aria-label]': 'text()' },
})
export class CoverageBar {
  readonly expert = input.required<number>();
  readonly intermediate = input.required<number>();
  readonly beginner = input.required<number>();
  /** Headcount the bar is scaled to. */
  readonly total = input<number>();

  protected readonly rest = computed(() => {
    const assessed = this.expert() + this.intermediate() + this.beginner();
    return Math.max(0, (this.total() ?? assessed) - assessed);
  });
  protected readonly text = computed(
    () => `${this.expert()} expert, ${this.intermediate()} intermediate, ${this.beginner()} beginner`,
  );
}
