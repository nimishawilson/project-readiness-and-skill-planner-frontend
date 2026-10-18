import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Employee } from '../employee.model';

@Component({
  selector: 'app-profile-grid',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl>
      <div><dt>Employee ID</dt><dd>{{ employee().employeeCode }}</dd></div>
      <div><dt>Email</dt><dd>{{ employee().email }}</dd></div>
      <div><dt>Location</dt><dd>{{ employee().location }}</dd></div>
      <div><dt>Joined</dt><dd>{{ employee().joined | date: 'd MMM y' }}</dd></div>
      <div><dt>Reports to</dt><dd>{{ employee().reportsTo }}</dd></div>
      <div><dt>Team</dt><dd>{{ employee().team }}</dd></div>
    </dl>
  `,
  styleUrl: './profile-grid.scss',
})
export class ProfileGrid {
  readonly employee = input.required<Employee>();
}
