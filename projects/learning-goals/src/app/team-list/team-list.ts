import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CountBadge, EmployeeCell, FilterChips, ListItem, ProgressDots, SearchInput, type FilterChipOption } from '@app/ui-kit';
import { MAX_GOALS_PER_YEAR, type TeamMember } from '../learning-goals.model';

export interface TeamRow {
  member: TeamMember;
  /** Goals this year. */
  count: number;
  /** Completed goals waiting for approval. */
  pending: number;
}

/** Searchable, filterable team list. The page owns the filtering; this reports the query, filter and selection. */
@Component({
  selector: 'app-team-list',
  imports: [CountBadge, EmployeeCell, FilterChips, ListItem, ProgressDots, SearchInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamList {
  readonly rows = input.required<TeamRow[]>();
  readonly selectedId = input<number>();
  readonly query = model('');
  readonly filter = model('all');
  readonly selected = output<number>();

  protected readonly template = 'minmax(0, 1fr) auto';
  protected readonly maxGoals = MAX_GOALS_PER_YEAR;
  protected readonly filters: FilterChipOption[] = [
    { value: 'all', label: 'All' },
    { value: 'awaiting', label: 'Awaiting approval' },
    { value: 'open', label: 'Has open slots' },
  ];
}
