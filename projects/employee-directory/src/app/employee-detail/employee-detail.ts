import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar, Badge, Button, DetailSection, EmptyState } from '@app/ui-kit';
import type { Employee } from '../employee.model';
import { GoalsSection } from './goals-section';
import { ProfileGrid } from './profile-grid';
import { SkillsSection } from './skills-section';

/** Right-hand pane: empty state until an employee is picked, then profile, skills and goals. */
@Component({
  selector: 'app-employee-detail',
  imports: [Avatar, Badge, Button, DetailSection, EmptyState, GoalsSection, ProfileGrid, SkillsSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss',
})
export class EmployeeDetail {
  readonly employee = input<Employee>();
  readonly closed = output<void>();
}
