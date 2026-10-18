import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { PROFICIENCY_OPTIONS, ProficiencyValue } from './proficiency.utils';

/** Native dropdown over Not assessed / Beginner / Intermediate / Expert. Use `[(value)]`. */
@Component({
  selector: 'app-proficiency-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select [attr.aria-label]="label()" [disabled]="disabled()" (change)="onChange($event)">
      @for (option of options; track option.value) {
        <option [value]="option.value" [selected]="option.value === value()">{{ option.label }}</option>
      }
    </select>
  `,
  styleUrl: './proficiency-select.scss',
})
export class ProficiencySelect {
  readonly value = model<ProficiencyValue>('NOT_ASSESSED');
  /** Accessible name, e.g. "Java level". */
  readonly label = input.required<string>();
  readonly disabled = input(false);

  protected readonly options = PROFICIENCY_OPTIONS;

  protected onChange(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value as ProficiencyValue);
  }
}
