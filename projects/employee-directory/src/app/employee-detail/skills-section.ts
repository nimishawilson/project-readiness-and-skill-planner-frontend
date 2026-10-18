import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, signal } from '@angular/core';
import {
  Button,
  DetailSection,
  FormField,
  PROFICIENCY_OPTIONS,
  ProficiencyMeter,
  ProficiencySelect,
  type ProficiencyValue,
} from '@app/ui-kit';
import type { EmployeeSkill } from '../employee.model';

/** Skills of one employee. Edits are kept in local state only (no API yet). */
@Component({
  selector: 'app-skills-section',
  imports: [Button, DetailSection, FormField, ProficiencyMeter, ProficiencySelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSection {
  readonly skills = input.required<EmployeeSkill[]>();
  readonly canEdit = input(false);

  protected readonly items = linkedSignal(() => this.skills());
  protected readonly newName = signal('');
  protected readonly newLevel = signal<ProficiencyValue>('BEGINNER');
  protected readonly levelOptions = PROFICIENCY_OPTIONS.filter((o) => o.value !== 'NOT_ASSESSED');
  protected readonly canAdd = computed(() => this.newName().trim().length > 0);

  protected setLevel(name: string, level: ProficiencyValue): void {
    this.items.update((list) => list.map((s) => (s.name === name ? { ...s, level } : s)));
  }

  protected remove(name: string): void {
    this.items.update((list) => list.filter((s) => s.name !== name));
  }

  protected add(): void {
    const name = this.newName().trim().replace(/\s+/g, ' ');
    if (!name) return;
    const exists = this.items().some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (!exists) this.items.update((list) => [...list, { name, level: this.newLevel() }]);
    this.newName.set('');
    this.newLevel.set('BEGINNER');
  }
}
