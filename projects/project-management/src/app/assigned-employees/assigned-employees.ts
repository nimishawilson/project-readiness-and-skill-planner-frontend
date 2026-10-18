import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar, Button, DetailSection, SkillChip, type ProficiencyValue } from '@app/ui-kit';
import { plural, type TeamMember } from '../project-management.model';

export interface AssignedView {
  member: TeamMember;
  /** Skills where this person meets a requirement. */
  skills: { name: string; level: ProficiencyValue }[];
  /** Other projects this person is on in the same year. */
  otherProjects: number;
}

/** People assigned to the project this year, with the skills that count and an Unassign action. */
@Component({
  selector: 'app-assigned-employees',
  imports: [Avatar, Button, DetailSection, SkillChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assigned-employees.html',
  styleUrl: './assigned-employees.scss',
})
export class AssignedEmployees {
  readonly items = input.required<AssignedView[]>();
  /** Show Unassign (current year only). */
  readonly editable = input.required<boolean>();

  readonly unassign = output<number>();

  protected others(count: number): string {
    return count === 0 ? 'No other projects' : `On ${plural(count, 'other project')}`;
  }
}
