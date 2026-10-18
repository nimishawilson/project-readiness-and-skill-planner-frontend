import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Avatar, EmptyState, GoalCard, ProgressDots, type GoalProgress } from '@app/ui-kit';
import { AssignGoalForm, type NewGoal } from '../assign-goal-form/assign-goal-form';
import { MAX_GOALS_PER_YEAR, type TeamGoal, type TeamMember } from '../learning-goals.model';

export interface ProgressChange {
  goalId: number;
  progress: GoalProgress;
}

/** One employee's goals for the selected year, with approval actions and the assign form. */
@Component({
  selector: 'app-member-goals',
  imports: [Avatar, AssignGoalForm, EmptyState, GoalCard, ProgressDots],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './member-goals.html',
  styleUrl: './member-goals.scss',
})
export class MemberGoals {
  readonly member = input<TeamMember>();
  readonly year = input.required<number>();
  readonly goals = input.required<TeamGoal[]>();
  /** False for years that have ended: goals are read only and nothing can be assigned. */
  readonly yearOpen = input.required<boolean>();

  readonly approve = output<number>();
  readonly sendBack = output<number>();
  readonly progressChange = output<ProgressChange>();
  readonly assign = output<NewGoal>();

  protected readonly maxGoals = MAX_GOALS_PER_YEAR;
  protected readonly firstName = computed(() => this.member()?.name.split(' ')[0] ?? '');
}
