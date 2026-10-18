import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { Badge, FilterChips, ListItem, SearchInput, type FilterChipOption } from '@app/ui-kit';
import { plural, type ProjectView } from '../project-management.model';

/** Searchable, filterable list of the year's projects. The page owns the filtering. */
@Component({
  selector: 'app-project-list',
  imports: [Badge, FilterChips, ListItem, SearchInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  readonly rows = input.required<ProjectView[]>();
  readonly selectedId = input<number>();
  readonly year = input.required<number>();
  /** True when the year has projects but search or filter hides them all. */
  readonly filtered = input(false);
  readonly query = model('');
  readonly filter = model('all');
  readonly selected = output<number>();

  protected readonly template = 'minmax(0, 1fr)';
  protected readonly filters: FilterChipOption[] = [
    { value: 'all', label: 'All' },
    { value: 'ready', label: 'Ready to start' },
    { value: 'notReady', label: 'Not ready' },
  ];

  protected people(count: number): string {
    return plural(count, 'person', 'people');
  }

  protected skills(count: number): string {
    return plural(count, 'skill');
  }
}
