import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import {
  Badge,
  CountBadge,
  EmployeeCell,
  FilterChips,
  type FilterChipOption,
  ListHeader,
  ListItem,
  SearchInput,
} from '@app/ui-kit';
import { awaitingApproval, type Employee } from '../employee.model';

/** Left-hand pane: search, department chips, result summary and the selectable employee rows. */
@Component({
  selector: 'app-employee-list',
  imports: [Badge, CountBadge, EmployeeCell, FilterChips, ListHeader, ListItem, SearchInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  /** Already filtered by the page. */
  readonly employees = input.required<Employee[]>();
  readonly total = input.required<number>();
  readonly departments = input.required<FilterChipOption[]>();
  readonly selectedId = input<number>();
  readonly query = model('');
  readonly department = model<string>();
  readonly selected = output<number>();

  protected readonly columns = ['Employee', 'Department', 'Access'];
  protected readonly template = 'minmax(0, 1fr) 140px 120px';
  protected readonly awaiting = awaitingApproval;
}
