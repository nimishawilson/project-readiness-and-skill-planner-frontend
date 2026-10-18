import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Badge, Button, Callout, Checkbox, FormField, proficiencyLabel, YearSelect } from '@app/ui-kit';
import { NewRequirement, RequirementAdder } from '../requirement-adder/requirement-adder';
import {
  computeReadiness,
  DESCRIPTION_MAX,
  describeNeeds,
  NAME_MAX,
  normalizeText,
  plural,
  type Requirement,
  type Skill,
  type TeamMember,
} from '../project-management.model';

export interface NewProject {
  name: string;
  description?: string;
  year: number;
  requirements: NewRequirement[];
  assignedIds: number[];
}

/** Create a project: details, skill requirements and (current year only) team members, with a live readiness preview. */
@Component({
  selector: 'app-project-form',
  imports: [Badge, Button, Callout, Checkbox, FormField, RequirementAdder, YearSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm {
  readonly skills = input.required<Skill[]>();
  readonly team = input.required<TeamMember[]>();
  readonly currentYear = input.required<number>();

  readonly create = output<NewProject>();
  readonly cancel = output<void>();

  protected readonly nameMax = NAME_MAX;
  protected readonly descriptionMax = DESCRIPTION_MAX;

  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly year = signal(0);
  protected readonly requirements = signal<Requirement[]>([]);
  protected readonly selectedIds = signal<number[]>([]);

  protected readonly years = computed(() => [this.currentYear(), this.currentYear() + 1]);
  protected readonly yearValue = computed(() => this.year() || this.currentYear());
  /** People can be assigned only in the current year. */
  protected readonly canAssign = computed(() => this.yearValue() === this.currentYear());
  protected readonly cleanName = computed(() => normalizeText(this.name()));
  protected readonly nameError = computed(() =>
    this.cleanName().length > NAME_MAX ? `Keep the name to ${NAME_MAX} characters.` : undefined,
  );
  protected readonly descriptionError = computed(() =>
    this.description().trim().length > DESCRIPTION_MAX ? `Keep the description to ${DESCRIPTION_MAX} characters.` : undefined,
  );
  protected readonly canCreate = computed(
    () => this.cleanName().length > 0 && !this.nameError() && !this.descriptionError(),
  );

  protected readonly assignees = computed(() =>
    this.canAssign() ? this.team().filter((m) => this.selectedIds().includes(m.id)) : [],
  );
  protected readonly readiness = computed(() => computeReadiness(this.requirements(), this.assignees()));
  protected readonly previewReady = computed(() => this.readiness().status === 'READY');
  protected readonly previewText = computed(() => {
    const { rows, totalNeeded } = this.readiness();
    if (rows.length === 0) return 'Add skill requirements to track readiness.';
    if (totalNeeded === 0) return 'All requirements are covered by the people you picked.';
    const people = totalNeeded === 1 ? 'person' : 'people';
    return `${totalNeeded} more qualified ${people} needed: ${describeNeeds(rows, this.skills())}.`;
  });

  protected skillName(id: number): string {
    return this.skills().find((s) => s.id === id)?.name ?? 'Unknown skill';
  }

  protected levelText(requirement: Requirement): string {
    return `${proficiencyLabel(requirement.minLevel)}+`;
  }

  protected people(count: number): string {
    return plural(count, 'person', 'people');
  }

  protected needed(requirementId: number): number {
    return this.readiness().rows.find((r) => r.requirement.id === requirementId)?.additionalNeeded ?? 0;
  }

  protected addRequirement(next: NewRequirement): void {
    const id = Math.max(0, ...this.requirements().map((r) => r.id)) + 1;
    this.requirements.update((list) => [...list, { id, ...next }]);
  }

  protected removeRequirement(id: number): void {
    this.requirements.update((list) => list.filter((r) => r.id !== id));
  }

  protected toggle(memberId: number, checked: boolean): void {
    this.selectedIds.update((ids) => (checked ? [...ids.filter((i) => i !== memberId), memberId] : ids.filter((i) => i !== memberId)));
  }

  protected submit(): void {
    if (!this.canCreate()) return;
    const description = this.description().trim();
    this.create.emit({
      name: this.cleanName(),
      description: description || undefined,
      year: this.yearValue(),
      requirements: this.requirements().map(({ skillId, minLevel, peopleRequired }) => ({ skillId, minLevel, peopleRequired })),
      assignedIds: this.assignees().map((m) => m.id),
    });
  }
}
