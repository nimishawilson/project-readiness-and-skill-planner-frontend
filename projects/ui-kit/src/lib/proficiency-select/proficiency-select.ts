import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { PROFICIENCY_OPTIONS, ProficiencyValue } from './proficiency.utils';

export type ProficiencySelectAppearance = 'default' | 'cell';

/**
 * Native dropdown over Not assessed / Beginner / Intermediate / Expert. Use `[(value)]`.
 * `appearance="cell"` colors the control by level for dense grids such as the skills matrix;
 * `highlighted` outlines it as the target of a pending bulk update.
 */
@Component({
  selector: 'app-proficiency-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      [attr.aria-label]="label()"
      [attr.data-level]="value()"
      [disabled]="disabled()"
      (change)="onChange($event)"
    >
      @for (option of options(); track option.value) {
        <option [value]="option.value" [selected]="option.value === value()">{{ option.label }}</option>
      }
    </select>
  `,
  styleUrl: './proficiency-select.scss',
  host: {
    '[class.app-proficiency-select--cell]': 'appearance() === "cell"',
    '[class.app-proficiency-select--highlighted]': 'highlighted()',
  },
})
export class ProficiencySelect {
  readonly value = model<ProficiencyValue>('NOT_ASSESSED');
  /** Accessible name, e.g. "Java level". */
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly appearance = input<ProficiencySelectAppearance>('default');
  /** Outlines the control in the warning color (a cell about to be changed by a bulk update). */
  readonly highlighted = input(false);

  /** Offer "Not assessed". Turn off for pickers that need a real level, e.g. a requirement's minimum. */
  readonly includeNotAssessed = input(true);

  protected readonly options = computed(() =>
    this.includeNotAssessed() ? PROFICIENCY_OPTIONS : PROFICIENCY_OPTIONS.filter((o) => o.value !== 'NOT_ASSESSED'),
  );

  protected onChange(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value as ProficiencyValue);
  }
}
