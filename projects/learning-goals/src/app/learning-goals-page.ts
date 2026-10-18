import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MasterDetail, PageHeader, StatCard, YearSelect, type GoalProgress } from '@app/ui-kit';
import { ApprovalBanner, type PendingItem } from './approval-banner/approval-banner';
import type { NewGoal } from './assign-goal-form/assign-goal-form';
import { CURRENT_YEAR, GOALS, TEAM } from './learning-goals.mock';
import {
  canAssignIn,
  goalsFor,
  isAwaiting,
  MAX_GOALS_PER_YEAR,
  summarize,
  type TeamFilter,
  type TeamGoal,
} from './learning-goals.model';
import { MemberGoals, type ProgressChange } from './member-goals/member-goals';
import { TeamList, type TeamRow } from './team-list/team-list';

/** Manager view of the team's learning goals. State is local (no API yet). */
@Component({
  selector: 'app-learning-goals-page',
  imports: [ApprovalBanner, MasterDetail, MemberGoals, PageHeader, StatCard, TeamList, YearSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './learning-goals-page.html',
  styleUrl: './learning-goals-page.scss',
})
export class LearningGoalsPage {
  protected readonly years = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

  protected readonly year = signal(CURRENT_YEAR);
  protected readonly query = signal('');
  protected readonly filter = signal('all');
  protected readonly selectedId = signal<number | undefined>(TEAM[0].id);
  private readonly goals = signal<TeamGoal[]>(GOALS);

  private readonly yearGoals = computed(() => this.goals().filter((g) => g.year === this.year()));

  /** Years that have ended are read only. */
  protected readonly yearOpen = computed(() => this.year() >= CURRENT_YEAR);
  protected readonly canAssign = computed(() => canAssignIn(this.year(), CURRENT_YEAR));
  protected readonly summary = computed(() => summarize(this.yearGoals()));

  protected readonly pending = computed<PendingItem[]>(() =>
    this.yearGoals()
      .filter(isAwaiting)
      .flatMap((goal) => {
        const member = TEAM.find((m) => m.id === goal.employeeId);
        return member ? [{ goal, member }] : [];
      }),
  );

  protected readonly rows = computed<TeamRow[]>(() => {
    const query = this.query().trim().toLowerCase();
    const filter = this.filter() as TeamFilter;
    return TEAM.map((member) => {
      const own = this.yearGoals().filter((g) => g.employeeId === member.id);
      return { member, count: own.length, pending: own.filter(isAwaiting).length };
    }).filter(
      (row) =>
        row.member.name.toLowerCase().includes(query) &&
        (filter === 'all' ||
          (filter === 'awaiting' && row.pending > 0) ||
          (filter === 'open' && row.count < MAX_GOALS_PER_YEAR)),
    );
  });

  protected readonly selected = computed(() => TEAM.find((m) => m.id === this.selectedId()));
  protected readonly selectedGoals = computed(() => {
    const id = this.selectedId();
    return id === undefined ? [] : goalsFor(this.goals(), id, this.year());
  });

  protected approve(goalId: number): void {
    this.update(goalId, (g) => (isAwaiting(g) ? { ...g, approvalStatus: 'APPROVED' } : g));
  }

  protected sendBack(goalId: number): void {
    this.update(goalId, (g) => (isAwaiting(g) ? { ...g, progressStatus: 'IN_PROGRESS' } : g));
  }

  protected changeProgress({ goalId, progress }: ProgressChange): void {
    this.update(goalId, (g) => (g.approvalStatus === 'APPROVED' ? g : { ...g, progressStatus: progress as GoalProgress }));
  }

  protected assign(goal: NewGoal): void {
    const employeeId = this.selectedId();
    if (employeeId === undefined || !this.canAssign()) return;
    if (goalsFor(this.goals(), employeeId, this.year()).length >= MAX_GOALS_PER_YEAR) return;
    const id = Math.max(0, ...this.goals().map((g) => g.id)) + 1;
    const created: TeamGoal = {
      id,
      employeeId,
      year: this.year(),
      title: goal.title,
      description: goal.description,
      progressStatus: 'NOT_STARTED',
      approvalStatus: 'PENDING',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.goals.update((list) => [...list, created]);
  }

  private update(goalId: number, change: (goal: TeamGoal) => TeamGoal): void {
    if (!this.yearOpen()) return;
    this.goals.update((list) => list.map((g) => (g.id === goalId ? change(g) : g)));
  }
}
