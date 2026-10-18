import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { Button, FormField, PROFICIENCY_OPTIONS, proficiencyLabel, type ProficiencyValue } from '@app/ui-kit';
import type { MatrixSkill } from '../skill-matrix.model';

/** Strip above the matrix: pick a skill and level, then apply it to every ticked employee. */
@Component({
  selector: 'app-bulk-update-bar',
  imports: [Button, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bulk-update-bar.html',
  styleUrl: './bulk-update-bar.scss',
  host: { '[class.active]': 'count() > 0' },
})
export class BulkUpdateBar {
  readonly count = input.required<number>();
  readonly skills = input.required<MatrixSkill[]>();
  /** Chosen skill id; undefined until one is picked. */
  readonly skillId = model<number | undefined>(undefined);
  readonly level = model<ProficiencyValue>('EXPERT');
  readonly canApply = input.required<boolean>();
  readonly apply = output<void>();
  readonly clear = output<void>();

  protected readonly levels = PROFICIENCY_OPTIONS;
  protected readonly skillName = computed(() => this.skills().find((s) => s.id === this.skillId())?.name);
  protected readonly levelLabel = computed(() => proficiencyLabel(this.level()));

  protected onSkill(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.skillId.set(value ? Number(value) : undefined);
  }

  protected onLevel(event: Event): void {
    this.level.set((event.target as HTMLSelectElement).value as ProficiencyValue);
  }
}
