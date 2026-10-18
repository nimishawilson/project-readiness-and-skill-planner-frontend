import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MasterDetail, PageHeader, StatCard, type FilterChipOption } from '@app/ui-kit';
import { EmployeeDetail } from './employee-detail/employee-detail';
import { EmployeeList } from './employee-list/employee-list';
import { EMPLOYEES } from './employee.mock';
import { awaitingApproval } from './employee.model';

const ALL = 'all';

/** Manager's employee directory. Static data for now; search, filter and selection run on local state. */
@Component({
  selector: 'app-employee-directory-page',
  imports: [EmployeeDetail, EmployeeList, MasterDetail, PageHeader, StatCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-directory-page.html',
  styleUrl: './employee-directory-page.scss',
})
export class EmployeeDirectoryPage {
  private readonly employees = signal(EMPLOYEES);

  protected readonly query = signal('');
  protected readonly department = signal<string | undefined>(undefined);
  protected readonly selectedId = signal<number | undefined>(undefined);

  protected readonly total = computed(() => this.employees().length);
  protected readonly teamCount = computed(() => this.employees().filter((e) => e.isMyTeam).length);
  protected readonly awaitingCount = computed(() =>
    this.employees().reduce((sum, e) => sum + awaitingApproval(e), 0),
  );

  protected readonly departments = computed<FilterChipOption[]>(() => {
    const counts = new Map<string, number>();
    for (const e of this.employees()) counts.set(e.department, (counts.get(e.department) ?? 0) + 1);
    const names = [...counts.keys()].sort((a, b) => a.localeCompare(b));
    return [
      { value: ALL, label: 'All', count: this.total() },
      ...names.map((name) => ({ value: name, label: name, count: counts.get(name) })),
    ];
  });

  protected readonly filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    const department = this.department();
    return this.employees().filter(
      (e) =>
        (!department || department === ALL || e.department === department) &&
        (!query || e.name.toLowerCase().split(' ').some((part) => part.startsWith(query)) || e.name.toLowerCase().startsWith(query)),
    );
  });

  protected readonly selected = computed(() => this.employees().find((e) => e.id === this.selectedId()));
}
