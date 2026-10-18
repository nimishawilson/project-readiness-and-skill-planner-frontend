import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { proficiencyLabel, type ProficiencyValue } from '../proficiency-select/proficiency.utils';

/** Pill showing a skill and a level, e.g. "Java · Expert". `met` adds a check (a requirement it satisfies). */
@Component({
  selector: 'app-skill-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (met()) {
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    }
    {{ text() }}
  `,
  styleUrl: './skill-chip.scss',
})
export class SkillChip {
  readonly skill = input.required<string>();
  readonly level = input.required<ProficiencyValue>();
  readonly met = input(false);

  protected readonly text = computed(() => `${this.skill()} · ${proficiencyLabel(this.level())}`);
}
