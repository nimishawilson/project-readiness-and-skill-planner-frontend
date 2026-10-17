import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, viewChildren } from '@angular/core';
import { nextChipIndex } from './filter-chips.utils';

export interface FilterChipOption {
  /** Stable key, e.g. `awaiting`. Shown nowhere. */
  value: string;
  /** Text on the chip, e.g. "Awaiting approval". */
  label: string;
  /** Optional number shown after the label. */
  count?: number;
}

/**
 * Single-select pill filters (e.g. "All · Awaiting approval · Has open slots", or departments).
 * Behaves as a radio group: one chip is active, arrow keys move the selection.
 * The page owns the filtering; this only reports the chosen `value`.
 */
@Component({
  selector: 'app-filter-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (option of options(); track option.value) {
      <button
        #chip
        type="button"
        role="radio"
        [attr.aria-checked]="option.value === active()"
        [tabindex]="option.value === active() ? 0 : -1"
        (click)="select(option.value)"
        (keydown)="onKeydown($event, $index)"
      >
        {{ option.label }}
        @if (option.count != null) {
          <span class="count">{{ option.count }}</span>
        }
      </button>
    }
  `,
  styleUrl: './filter-chips.scss',
  host: { role: 'radiogroup', '[attr.aria-label]': 'label()' },
})
export class FilterChips {
  /** The chips, in order. The first is the default (usually "All"). */
  readonly options = input.required<FilterChipOption[]>();
  /** Accessible name of the group, e.g. "Filter team". */
  readonly label = input.required<string>();
  /** `value` of the selected chip; use `[(value)]`. Unset or unknown selects the first chip. */
  readonly value = model<string>();

  private readonly chips = viewChildren<ElementRef<HTMLButtonElement>>('chip');

  protected readonly active = computed(() => {
    const options = this.options();
    return options.some((o) => o.value === this.value()) ? this.value() : options[0]?.value;
  });

  protected select(value: string): void {
    if (value !== this.active()) this.value.set(value);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const next = nextChipIndex(event.key, index, this.options().length);
    if (next < 0) return;
    event.preventDefault();
    this.select(this.options()[next].value);
    this.chips()[next].nativeElement.focus();
  }
}
