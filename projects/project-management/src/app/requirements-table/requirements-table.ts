import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  Badge,
  Button,
  DetailSection,
  HeadcountMeter,
  ProficiencySelect,
  proficiencyLabel,
  QuantityStepper,
  type ProficiencyValue,
} from '@app/ui-kit';
import { NewRequirement, RequirementAdder } from '../requirement-adder/requirement-adder';
import {
  isDuplicateRequirement,
  PEOPLE_MAX,
  requirementLabel,
  type MinLevel,
  type RequirementStatus,
  type Skill,
} from '../project-management.model';

export interface LevelChange {
  requirementId: number;
  minLevel: MinLevel;
}

export interface PeopleChange {
  requirementId: number;
  peopleRequired: number;
}

/** A project's skill requirements for one year with who is still needed; editable only when `editable`. */
@Component({
  selector: 'app-requirements-table',
  imports: [Badge, Button, DetailSection, HeadcountMeter, ProficiencySelect, QuantityStepper, RequirementAdder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requirements-table.html',
  styleUrl: './requirements-table.scss',
})
export class RequirementsTable {
  readonly rows = input.required<RequirementStatus[]>();
  readonly skills = input.required<Skill[]>();
  readonly editable = input.required<boolean>();

  readonly add = output<NewRequirement>();
  readonly levelChange = output<LevelChange>();
  readonly peopleChange = output<PeopleChange>();
  readonly remove = output<number>();

  protected readonly peopleMax = PEOPLE_MAX;
  protected readonly requirements = computed(() => this.rows().map((r) => r.requirement));
  protected readonly met = computed(() => this.rows().filter((r) => r.additionalNeeded === 0).length);

  /** A rejected level change (it would repeat a skill and level) and the row it was on. */
  protected readonly conflict = signal<string | undefined>(undefined);
  /** Bumped to rebuild the level selects after a rejected change so they show the real level again. */
  protected readonly resetKey = signal(0);

  protected skillName(id: number): string {
    return this.skills().find((s) => s.id === id)?.name ?? 'Unknown skill';
  }

  protected levelLabel(level: ProficiencyValue): string {
    return proficiencyLabel(level);
  }

  protected changeLevel(row: RequirementStatus, level: ProficiencyValue): void {
    const minLevel = level as MinLevel;
    const { requirement } = row;
    if (minLevel === requirement.minLevel) return;
    const others = this.requirements().filter((r) => r.id !== requirement.id);
    if (isDuplicateRequirement(others, requirement.skillId, minLevel)) {
      this.conflict.set(
        `${requirementLabel({ ...requirement, minLevel }, this.skills())} is already a requirement. Update that row instead.`,
      );
      this.resetKey.update((k) => k + 1);
      return;
    }
    this.conflict.set(undefined);
    this.levelChange.emit({ requirementId: requirement.id, minLevel });
  }
}
