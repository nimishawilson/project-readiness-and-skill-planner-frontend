import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, signal } from '@angular/core';
import { Button, DetailSection, FormField, GoalCard } from '@app/ui-kit';
import type { EmployeeGoal } from '../employee.model';

/** Max learning goals per employee per year (spec 3.3). */
const MAX_GOALS = 3;

/** Current-year goals of one employee. Edits are kept in local state only (no API yet). */
@Component({
  selector: 'app-goals-section',
  imports: [Button, DetailSection, FormField, GoalCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './goals-section.html',
  styleUrl: './goals-section.scss',
})
export class GoalsSection {
  readonly goals = input.required<EmployeeGoal[]>();
  readonly canEdit = input(false);

  protected readonly items = linkedSignal(() => this.goals());
  protected readonly title = signal('');
  protected readonly target = signal('');
  protected readonly maxGoals = MAX_GOALS;

  protected readonly awaiting = computed(
    () => this.items().filter((g) => g.progress === 'COMPLETED' && !g.approved).length,
  );
  protected readonly atLimit = computed(() => this.items().length >= MAX_GOALS);
  protected readonly canAdd = computed(() => this.title().trim().length > 0 && this.target().length > 0);

  protected approve(id: number): void {
    this.items.update((list) => list.map((g) => (g.id === id ? { ...g, approved: true } : g)));
  }

  protected sendBack(id: number): void {
    this.items.update((list) =>
      list.map((g) => (g.id === id ? { ...g, progress: 'IN_PROGRESS', completedDate: undefined } : g)),
    );
  }

  protected add(): void {
    if (!this.canAdd() || this.atLimit()) return;
    const title = this.title().trim().replace(/\s+/g, ' ');
    const id = Math.max(0, ...this.items().map((g) => g.id)) + 1;
    this.items.update((list) => [
      ...list,
      { id, title, targetDate: this.target(), progress: 'NOT_STARTED', approved: false },
    ]);
    this.title.set('');
    this.target.set('');
  }
}
