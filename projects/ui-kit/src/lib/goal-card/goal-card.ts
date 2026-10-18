import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Badge } from '../badge/badge';
import { Button } from '../button/button';
import { SegmentedControl, SegmentedOption } from '../segmented-control/segmented-control';

export type GoalProgress = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

const PROGRESS_OPTIONS: SegmentedOption[] = [
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

/**
 * One learning goal. A completed goal that is not yet approved is highlighted and, when
 * `canApprove` is set, offers Approve completion and Send back (outputs `approve` and `sendBack`).
 * With `showProgress` the progress segments are shown; they are editable only while `canEditProgress`
 * is set and the goal is not approved (approved goals are locked).
 */
@Component({
  selector: 'app-goal-card',
  imports: [Badge, Button, DatePipe, SegmentedControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <h4>{{ title() }}</h4>
      <div class="approval">
        <span class="caption">Approval</span>
        <app-badge [variant]="status().variant" [emphasis]="approved() ? 'solid' : 'soft'">{{ status().label }}</app-badge>
      </div>
    </div>
    @if (description()) {
      <p class="description">{{ description() }}</p>
    }
    @if (assignedDate()) {
      <p class="dates">Assigned {{ assignedDate() | date: 'd MMM y' }}</p>
    }
    @if (showProgress()) {
      <span class="caption">Progress</span>
    }
    <div class="footer">
      @if (showProgress()) {
        <app-segmented-control
          label="Progress"
          [options]="progressOptions"
          [value]="progress()"
          [disabled]="approved() || !canEditProgress()"
          (valueChange)="progressChange.emit($any($event))"
        />
      }
      @if (needsApproval() && canApprove()) {
        <div class="actions">
          <button app-button variant="outline" size="sm" type="button" (click)="sendBack.emit()">Send back</button>
          <button app-button size="sm" type="button" (click)="approve.emit()">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Approve completion
          </button>
        </div>
      }
    </div>
    @if (showProgress() && approved()) {
      <p class="lock">
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
        Progress is locked after approval.
      </p>
    }
  `,
  styleUrl: './goal-card.scss',
  host: { '[class.app-goal-card--attention]': 'needsApproval()' },
})
export class GoalCard {
  readonly title = input.required<string>();
  readonly description = input<string>();
  /** ISO date string the goal was assigned (the API's `createdAt`). */
  readonly assignedDate = input<string>();
  readonly progress = input.required<GoalProgress>();
  readonly approved = input(false);
  /** Show the approval actions (manager of this employee only). */
  readonly canApprove = input(false);
  /** Show the Not started · In progress · Completed segments. */
  readonly showProgress = input(false);
  /** Let the user change progress (ignored once approved). */
  readonly canEditProgress = input(false);

  readonly approve = output<void>();
  readonly sendBack = output<void>();
  readonly progressChange = output<GoalProgress>();

  protected readonly progressOptions = PROGRESS_OPTIONS;

  protected readonly needsApproval = computed(() => this.progress() === 'COMPLETED' && !this.approved());

  protected readonly status = computed(() => {
    if (this.needsApproval()) return { label: 'Awaiting approval', variant: 'warning' as const };
    if (this.approved()) return { label: 'Approved', variant: 'success' as const };
    return { label: 'Not submitted', variant: 'neutral' as const };
  });
}
