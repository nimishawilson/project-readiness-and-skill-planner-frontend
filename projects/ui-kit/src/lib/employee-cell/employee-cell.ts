import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Avatar } from '../avatar/avatar';

export type EmployeeCellSize = 'sm' | 'md';

/**
 * Avatar with the employee's name and, optionally, their job title below.
 * Content placed inside the element is shown right after the name (e.g. a count dot).
 */
@Component({
  selector: 'app-employee-cell',
  imports: [Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-avatar [name]="name()" [size]="size()" [decorative]="true" />
    <div class="text">
      <div class="name-row">
        <span class="name" [attr.title]="name()">{{ name() }}</span>
        <ng-content />
      </div>
      @if (title()) {
        <div class="job-title" [attr.title]="title()">{{ title() }}</div>
      }
    </div>
  `,
  styleUrl: './employee-cell.scss',
  host: { '[class]': '"app-employee-cell--" + size()' },
})
export class EmployeeCell {
  /** Full name; shown as the main line and used for the avatar initials. */
  readonly name = input.required<string>();
  /** Job title, shown below the name. Hidden when empty. */
  readonly title = input<string>();
  /** `sm` for dense rows such as the skills matrix, `md` for lists and detail headers. */
  readonly size = input<EmployeeCellSize>('md');
}
