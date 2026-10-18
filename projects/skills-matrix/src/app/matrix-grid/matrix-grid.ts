import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  Checkbox,
  CoverageBar,
  DataGrid,
  EmployeeCell,
  GridCell,
  GridCorner,
  GridFooterCell,
  GridFooterLabel,
  GridHeader,
  GridRowHeader,
  ProficiencySelect,
  type GridColumn,
  type ProficiencyValue,
} from '@app/ui-kit';
import { coverageFor, levelOf, type MatrixEmployee, type MatrixSkill } from '../skill-matrix.model';

export interface LevelChange {
  employeeId: number;
  skillId: number;
  level: ProficiencyValue;
}

/** The matrix itself: employees down, skills across, one level select per cell, coverage in the footer. */
@Component({
  selector: 'app-matrix-grid',
  imports: [
    Checkbox,
    CoverageBar,
    DataGrid,
    EmployeeCell,
    GridCell,
    GridCorner,
    GridFooterCell,
    GridFooterLabel,
    GridHeader,
    GridRowHeader,
    ProficiencySelect,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './matrix-grid.html',
  styleUrl: './matrix-grid.scss',
})
export class MatrixGrid {
  /** Employees shown (after search). */
  readonly employees = input.required<MatrixEmployee[]>();
  /** The whole team, which the footer coverage counts. */
  readonly team = input.required<MatrixEmployee[]>();
  readonly skills = input.required<MatrixSkill[]>();
  readonly selectedIds = input.required<ReadonlySet<number>>();
  /** Skill id picked for a bulk update. */
  readonly targetSkillId = input<number>();
  readonly maxHeight = input<string>();

  readonly rowToggle = output<{ employeeId: number; selected: boolean }>();
  readonly toggleAll = output<boolean>();
  readonly skillTarget = output<number>();
  readonly levelChange = output<LevelChange>();

  protected readonly columns = computed<GridColumn[]>(() => this.skills().map((s) => ({ key: String(s.id), header: s.name })));
  protected readonly highlightKey = computed(() => (this.targetSkillId() === undefined ? undefined : String(this.targetSkillId())));
  protected readonly allSelected = computed(
    () => this.employees().length > 0 && this.employees().every((e) => this.selectedIds().has(e.id)),
  );
  protected readonly someSelected = computed(() => !this.allSelected() && this.employees().some((e) => this.selectedIds().has(e.id)));
  protected readonly coverage = computed(() => new Map(this.skills().map((s) => [String(s.id), coverageFor(s.id, this.team())])));

  protected readonly rowKey = (employee: MatrixEmployee) => employee.id;
  protected readonly isSelected = (employee: MatrixEmployee) => this.selectedIds().has(employee.id);
  protected readonly levelOf = levelOf;

  protected isTargeted(employee: MatrixEmployee, column: GridColumn): boolean {
    return this.isSelected(employee) && column.key === this.highlightKey();
  }
}
