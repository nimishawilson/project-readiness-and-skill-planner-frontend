import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Badge } from '../badge/badge';
import { Button } from '../button/button';

export type GoalProgress = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * One learning goal. A completed goal that is not yet approved is highlighted and, when
 * `canApprove` is set, offers Approve and Send back (outputs `approve` and `sendBack`).
 */
@Component({
  selector: 'app-goal-card',
  imports: [Badge, Button, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <h4>{{ title() }}</h4>
      <app-badge [variant]="status().variant">{{ status().label }}</app-badge>
    </div>
    <p class="dates">
      Target {{ targetDate() | date: 'd MMM y' }}
      @if (completedDate()) {
        · Marked complete {{ completedDate() | date: 'd MMM y' }}
      }
    </p>
    @if (needsApproval() && canApprove()) {
      <div class="actions">
        <button app-button variant="outline" size="sm" type="button" (click)="sendBack.emit()">Send back</button>
        <button app-button size="sm" type="button" (click)="approve.emit()">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Approve
        </button>
      </div>
    }
  `,
  styleUrl: './goal-card.scss',
  host: { '[class.app-goal-card--attention]': 'needsApproval()' },
})
export class GoalCard {
  readonly title = input.required<string>();
  /** ISO date string. */
  readonly targetDate = input.required<string>();
  readonly completedDate = input<string>();
  readonly progress = input.required<GoalProgress>();
  readonly approved = input(false);
  /** Show the approval actions (manager of this employee only). */
  readonly canApprove = input(false);

  readonly approve = output<void>();
  readonly sendBack = output<void>();

  protected readonly needsApproval = computed(() => this.progress() === 'COMPLETED' && !this.approved());

  protected readonly status = computed(() => {
    if (this.needsApproval()) return { label: 'Completed · needs approval', variant: 'warning' as const };
    if (this.progress() === 'COMPLETED') return { label: 'Approved', variant: 'success' as const };
    if (this.progress() === 'IN_PROGRESS') return { label: 'In progress', variant: 'neutral' as const };
    return { label: 'Not started', variant: 'neutral' as const };
  });
}
