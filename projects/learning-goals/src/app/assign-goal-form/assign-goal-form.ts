import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Button, Callout, FormField } from '@app/ui-kit';
import { DESCRIPTION_MAX, MAX_GOALS_PER_YEAR, normalizeText, slotsLeft, TITLE_MAX } from '../learning-goals.model';

export interface NewGoal {
  title: string;
  description?: string;
}

/**
 * "Assign a new goal" for one employee and year. Shows the form while slots are open, otherwise
 * the reason it is unavailable: the yearly limit, or a year that has ended.
 */
@Component({
  selector: 'app-assign-goal-form',
  imports: [Button, Callout, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assign-goal-form.html',
  styleUrl: './assign-goal-form.scss',
})
export class AssignGoalForm {
  readonly firstName = input.required<string>();
  readonly year = input.required<number>();
  /** Goals the employee already has this year. */
  readonly goalCount = input.required<number>();
  /** False for years that have ended (only the current and next year accept new goals). */
  readonly yearOpen = input.required<boolean>();

  readonly assign = output<NewGoal>();

  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly maxGoals = MAX_GOALS_PER_YEAR;
  protected readonly titleMax = TITLE_MAX;
  protected readonly descriptionMax = DESCRIPTION_MAX;

  protected readonly slots = computed(() => slotsLeft(this.goalCount()));
  protected readonly cleanTitle = computed(() => normalizeText(this.title()));
  protected readonly titleError = computed(() =>
    this.cleanTitle().length > TITLE_MAX ? `Keep the title to ${TITLE_MAX} characters.` : undefined,
  );
  protected readonly descriptionError = computed(() =>
    this.description().trim().length > DESCRIPTION_MAX ? `Keep the description to ${DESCRIPTION_MAX} characters.` : undefined,
  );
  protected readonly canSubmit = computed(
    () => this.cleanTitle().length > 0 && !this.titleError() && !this.descriptionError(),
  );

  protected submit(): void {
    if (!this.canSubmit() || this.slots() === 0 || !this.yearOpen()) return;
    const description = this.description().trim();
    this.assign.emit({ title: this.cleanTitle(), description: description || undefined });
    this.title.set('');
    this.description.set('');
  }
}
