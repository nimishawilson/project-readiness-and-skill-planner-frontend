import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Badge, Button, Callout } from '@app/ui-kit';
import { AssignCandidates, type CandidateView } from '../assign-candidates/assign-candidates';
import { AssignedEmployees, type AssignedView } from '../assigned-employees/assigned-employees';
import {
  describeNeeds,
  metSkills,
  otherProjectCount,
  plural,
  requirementLabel,
  wouldCover,
  type Project,
  type ProjectView,
  type Skill,
  type TeamMember,
} from '../project-management.model';
import type { NewRequirement } from '../requirement-adder/requirement-adder';
import { RequirementsTable, type LevelChange, type PeopleChange } from '../requirements-table/requirements-table';

/** One project in one year: header, readiness, requirements, assigned people and who could be added. */
@Component({
  selector: 'app-project-detail',
  imports: [AssignCandidates, AssignedEmployees, Badge, Button, Callout, RequirementsTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  readonly view = input.required<ProjectView>();
  /** Every project, for each person's other-project count. */
  readonly projects = input.required<Project[]>();
  readonly skills = input.required<Skill[]>();
  readonly team = input.required<TeamMember[]>();
  readonly year = input.required<number>();
  readonly requirementsEditable = input.required<boolean>();
  readonly assignmentsEditable = input.required<boolean>();
  readonly canMap = input.required<boolean>();

  readonly mapYear = output<void>();
  readonly addRequirement = output<NewRequirement>();
  readonly levelChange = output<LevelChange>();
  readonly peopleChange = output<PeopleChange>();
  readonly removeRequirement = output<number>();
  readonly assign = output<number>();
  readonly unassign = output<number>();

  protected readonly ready = computed(() => this.view().readiness.status === 'READY');
  protected readonly hasRequirements = computed(() => this.view().readiness.rows.length > 0);

  protected readonly needMessage = computed(() => {
    const { rows, totalNeeded } = this.view().readiness;
    const people = totalNeeded === 1 ? 'person' : 'people';
    const open = rows.filter((r) => r.additionalNeeded > 0).length;
    return `${totalNeeded} more qualified ${people} needed across ${plural(open, 'requirement')}: ${describeNeeds(rows, this.skills())}. You can keep working on the project in the meantime.`;
  });

  protected readonly assigned = computed<AssignedView[]>(() => {
    const { assignees, year, project } = this.view();
    return assignees.map((member) => ({
      member,
      skills: metSkills(member, year.requirements).map((s) => ({
        name: this.skills().find((k) => k.id === s.skillId)?.name ?? 'Unknown skill',
        level: s.level,
      })),
      otherProjects: otherProjectCount(member.id, this.projects(), year.year, project.id),
    }));
  });

  protected readonly candidates = computed<CandidateView[]>(() => {
    const { year, project, readiness } = this.view();
    return this.team()
      .filter((m) => !year.assignedIds.includes(m.id))
      .map((member) => ({
        member,
        otherProjects: otherProjectCount(member.id, this.projects(), year.year, project.id),
        covers: wouldCover(member, readiness.rows).map((r) => requirementLabel(r, this.skills())),
      }));
  });
}
