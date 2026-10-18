import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar, Button } from '@app/ui-kit';
import type { TeamGoal, TeamMember } from '../learning-goals.model';

export interface PendingItem {
  goal: TeamGoal;
  member: TeamMember;
}

/** Completed goals waiting for the manager's approval, with quick Approve and Send back. */
@Component({
  selector: 'app-approval-banner',
  imports: [Avatar, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './approval-banner.html',
  styleUrl: './approval-banner.scss',
})
export class ApprovalBanner {
  readonly items = input.required<PendingItem[]>();
  /** False for years that have ended: the list is shown without actions. */
  readonly canAct = input(true);

  readonly approve = output<number>();
  readonly sendBack = output<number>();
}
