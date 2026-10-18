import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Button, FormField, PROFICIENCY_OPTIONS } from '@app/ui-kit';
import {
  isDuplicateRequirement,
  PEOPLE_MAX,
  requirementLabel,
  type MinLevel,
  type Requirement,
  type Skill,
} from '../project-management.model';

export interface NewRequirement {
  skillId: number;
  minLevel: MinLevel;
  peopleRequired: number;
}

/** Skill, level and people inputs with an add button. Rejects a repeated skill and level. */
@Component({
  selector: 'app-requirement-adder',
  imports: [Button, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requirement-adder.html',
  styleUrl: './requirement-adder.scss',
})
export class RequirementAdder {
  readonly skills = input.required<Skill[]>();
  /** Requirements already on the project, for the duplicate check. */
  readonly existing = input.required<Requirement[]>();
  readonly buttonLabel = input('Add requirement');

  readonly add = output<NewRequirement>();

  protected readonly levels = PROFICIENCY_OPTIONS.filter((o) => o.value !== 'NOT_ASSESSED');
  protected readonly peopleMax = PEOPLE_MAX;

  private readonly pickedSkill = signal<number | undefined>(undefined);
  protected readonly level = signal<MinLevel>('INTERMEDIATE');
  protected readonly people = signal('1');

  protected readonly skillId = computed(() => this.pickedSkill() ?? this.skills()[0]?.id);
  protected readonly peopleCount = computed(() => Number(this.people()));
  protected readonly peopleValid = computed(
    () => Number.isInteger(this.peopleCount()) && this.peopleCount() >= 1 && this.peopleCount() <= PEOPLE_MAX,
  );
  protected readonly error = computed(() => {
    const skillId = this.skillId();
    if (skillId === undefined || !isDuplicateRequirement(this.existing(), skillId, this.level())) return undefined;
    const label = requirementLabel({ id: 0, skillId, minLevel: this.level(), peopleRequired: 1 }, this.skills());
    return `${label} is already a requirement. Update it instead.`;
  });
  protected readonly peopleError = computed(() =>
    this.peopleValid() ? undefined : `Enter a whole number from 1 to ${PEOPLE_MAX}.`,
  );
  protected readonly canAdd = computed(() => this.skillId() !== undefined && !this.error() && this.peopleValid());

  protected pickSkill(value: string): void {
    this.pickedSkill.set(Number(value));
  }

  protected submit(): void {
    const skillId = this.skillId();
    if (!this.canAdd() || skillId === undefined) return;
    this.add.emit({ skillId, minLevel: this.level(), peopleRequired: this.peopleCount() });
    this.people.set('1');
  }
}
