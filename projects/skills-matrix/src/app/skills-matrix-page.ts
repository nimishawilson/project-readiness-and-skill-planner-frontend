import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { EmptyState, Legend, PageHeader, SearchInput, type LegendItem, type ProficiencyValue } from '@app/ui-kit';
import { BulkUpdateBar } from './bulk-update-bar/bulk-update-bar';
import { MatrixGrid, type LevelChange } from './matrix-grid/matrix-grid';
import { MATRIX_EMPLOYEES, SKILLS } from './skill-matrix.mock';

const LEGEND: LegendItem[] = [
  { label: 'Not assessed', tone: 'empty' },
  { label: 'Beginner', tone: 'soft' },
  { label: 'Intermediate', tone: 'medium' },
  { label: 'Expert', tone: 'strong' },
];

/** Manager's skills matrix. Static data for now; search, selection and bulk updates run on local state. */
@Component({
  selector: 'app-skills-matrix-page',
  imports: [BulkUpdateBar, EmptyState, Legend, MatrixGrid, PageHeader, SearchInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills-matrix-page.html',
  styleUrl: './skills-matrix-page.scss',
})
export class SkillsMatrixPage {
  protected readonly legend = LEGEND;
  protected readonly skills = signal(SKILLS);
  protected readonly employees = signal(MATRIX_EMPLOYEES);

  protected readonly query = signal('');
  protected readonly selectedIds = signal<ReadonlySet<number>>(new Set());
  protected readonly targetSkillId = signal<number | undefined>(undefined);
  protected readonly targetLevel = signal<ProficiencyValue>('EXPERT');

  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.employees().filter(
      (e) => !query || e.name.toLowerCase().split(' ').some((part) => part.startsWith(query)) || e.name.toLowerCase().startsWith(query),
    );
  });

  protected readonly canApply = computed(() => this.selectedIds().size > 0 && this.targetSkillId() !== undefined);

  protected toggleRow(employeeId: number, selected: boolean): void {
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      if (selected) next.add(employeeId);
      else next.delete(employeeId);
      return next;
    });
  }

  /** Select or clear every row currently shown. */
  protected toggleAll(selected: boolean): void {
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      for (const e of this.filtered()) {
        if (selected) next.add(e.id);
        else next.delete(e.id);
      }
      return next;
    });
  }

  /** Clicking the heading of the skill that is already targeted un-targets it. */
  protected targetSkill(skillId: number): void {
    this.targetSkillId.update((current) => (current === skillId ? undefined : skillId));
  }

  protected setLevel({ employeeId, skillId, level }: LevelChange): void {
    this.employees.update((list) =>
      list.map((e) => (e.id === employeeId ? { ...e, levels: { ...e.levels, [skillId]: level } } : e)),
    );
  }

  /** Sets the chosen level for every ticked employee, then clears the ticks (the skill stays chosen). */
  protected apply(): void {
    const skillId = this.targetSkillId();
    if (skillId === undefined) return;
    const ids = this.selectedIds();
    const level = this.targetLevel();
    this.employees.update((list) =>
      list.map((e) => (ids.has(e.id) ? { ...e, levels: { ...e.levels, [skillId]: level } } : e)),
    );
    this.clear();
  }

  protected clear(): void {
    this.selectedIds.set(new Set());
  }
}
