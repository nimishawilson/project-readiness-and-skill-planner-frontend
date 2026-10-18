import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar, Button, Callout, DetailSection } from '@app/ui-kit';
import { plural, type TeamMember } from '../project-management.model';

export interface CandidateView {
  member: TeamMember;
  otherProjects: number;
  /** Labels of unmet requirements this person would cover, e.g. "Java Intermediate+". */
  covers: string[];
}

/** Team members not yet on the project. Those who would close a gap are highlighted. */
@Component({
  selector: 'app-assign-candidates',
  imports: [Avatar, Button, Callout, DetailSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assign-candidates.html',
  styleUrl: './assign-candidates.scss',
})
export class AssignCandidates {
  readonly items = input.required<CandidateView[]>();
  readonly year = input.required<number>();
  /** Assigning is open only in the current year. */
  readonly editable = input.required<boolean>();

  readonly assign = output<number>();

  protected others(count: number): string {
    return count === 0 ? 'No other projects' : `On ${plural(count, 'other project')}`;
  }
}
