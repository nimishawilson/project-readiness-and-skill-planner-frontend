import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { Button, Callout, Dialog, YearSelect } from '@app/ui-kit';
import { latestYear, mappableYears, plural, type Project } from '../project-management.model';

/** Roll a project forward to a later year, carrying its latest requirements and assignments. */
@Component({
  selector: 'app-map-year-dialog',
  imports: [Button, Callout, Dialog, YearSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-year-dialog.html',
  styleUrl: './map-year-dialog.scss',
})
export class MapYearDialog {
  readonly open = model(false);
  readonly project = input<Project>();
  readonly currentYear = input.required<number>();

  readonly mapYear = output<number>();

  private readonly picked = signal(0);

  protected readonly years = computed(() => {
    const project = this.project();
    return project ? mappableYears(project, this.currentYear()) : [];
  });
  protected readonly target = computed(() => (this.years().includes(this.picked()) ? this.picked() : this.years()[0]));
  protected readonly source = computed(() => {
    const project = this.project();
    return project ? latestYear(project) : undefined;
  });

  protected pick(year: number): void {
    this.picked.set(year);
  }

  protected requirementsText(count: number): string {
    return `${plural(count, 'skill requirement')} copied`;
  }

  protected peopleText(count: number): string {
    return `${plural(count, 'assigned employee')} carried forward`;
  }

  protected confirm(): void {
    const target = this.target();
    if (target === undefined) return;
    this.mapYear.emit(target);
    this.open.set(false);
  }
}
