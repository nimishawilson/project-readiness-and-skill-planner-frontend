import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, viewChildren } from '@angular/core';
import { nextChipIndex } from '../filter-chips/filter-chips.utils';

export interface SegmentedOption {
  /** Stable key, e.g. `IN_PROGRESS`. Shown nowhere. */
  value: string;
  /** Text on the segment, e.g. "In progress". */
  label: string;
}

/**
 * Joined single-select segments (e.g. Not started · In progress · Completed).
 * Behaves as a radio group: the selected segment shows a check, arrow keys move the selection.
 * When `disabled`, the value is shown but cannot change.
 */
@Component({
  selector: 'app-segmented-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (option of options(); track option.value) {
      <button
        #segment
        type="button"
        role="radio"
        [attr.aria-checked]="option.value === active()"
        [tabindex]="option.value === active() ? 0 : -1"
        [disabled]="disabled()"
        (click)="select(option.value)"
        (keydown)="onKeydown($event, $index)"
      >
        @if (option.value === active()) {
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        }
        {{ option.label }}
      </button>
    }
  `,
  styleUrl: './segmented-control.scss',
  host: { role: 'radiogroup', '[attr.aria-label]': 'label()', '[class.app-segmented-control--disabled]': 'disabled()' },
})
export class SegmentedControl {
  readonly options = input.required<SegmentedOption[]>();
  /** Accessible name of the group, e.g. "Progress". */
  readonly label = input.required<string>();
  /** `value` of the selected segment; use `[(value)]`. Unset or unknown selects none. */
  readonly value = model<string>();
  readonly disabled = input(false);

  private readonly segments = viewChildren<ElementRef<HTMLButtonElement>>('segment');

  protected readonly active = computed(() =>
    this.options().some((o) => o.value === this.value()) ? this.value() : this.options()[0]?.value,
  );

  protected select(value: string): void {
    if (!this.disabled() && value !== this.active()) this.value.set(value);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const next = nextChipIndex(event.key, index, this.options().length);
    if (next < 0) return;
    event.preventDefault();
    this.select(this.options()[next].value);
    this.segments()[next].nativeElement.focus();
  }
}
