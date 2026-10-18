import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Button, EmptyState, MasterDetail, PageHeader, StatCard, YearSelect } from '@app/ui-kit';
import { MapYearDialog } from './map-year-dialog/map-year-dialog';
import { CURRENT_YEAR, PROJECTS, SKILLS, TEAM } from './project-management.mock';
import {
  carryForward,
  isDuplicateRequirement,
  latestYear,
  mappableYears,
  normalizeText,
  projectView,
  yearOf,
  type Project,
  type ProjectFilter,
  type ProjectView,
  type ProjectYear,
  type Requirement,
} from './project-management.model';
import { ProjectDetail } from './project-detail/project-detail';
import { ProjectForm, type NewProject } from './project-form/project-form';
import { ProjectList } from './project-list/project-list';
import type { NewRequirement } from './requirement-adder/requirement-adder';
import type { LevelChange, PeopleChange } from './requirements-table/requirements-table';

/** Manager view of the team's projects and their readiness. State is local (no API yet). */
@Component({
  selector: 'app-project-management-page',
  imports: [Button, EmptyState, MapYearDialog, MasterDetail, PageHeader, ProjectDetail, ProjectForm, ProjectList, StatCard, YearSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-management-page.html',
  styleUrl: './project-management-page.scss',
})
export class ProjectManagementPage {
  protected readonly skills = SKILLS;
  protected readonly team = TEAM;
  protected readonly currentYear = CURRENT_YEAR;

  protected readonly year = signal(CURRENT_YEAR);
  protected readonly query = signal('');
  protected readonly filter = signal('all');
  protected readonly selectedId = signal<number | undefined>(undefined);
  protected readonly creating = signal(false);
  protected readonly mapOpen = signal(false);
  protected readonly projects = signal<Project[]>(PROJECTS);

  /** Previous, current and next year, plus any year a project has been mapped to. */
  protected readonly years = computed(() => {
    const all = new Set([CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1]);
    for (const project of this.projects()) for (const y of project.years) all.add(y.year);
    return [...all].sort((a, b) => a - b);
  });

  /** Years that have ended are read only. Requirements can change from the current year on; people only in it. */
  protected readonly requirementsEditable = computed(() => this.year() >= CURRENT_YEAR);
  protected readonly assignmentsEditable = computed(() => this.year() === CURRENT_YEAR);

  private readonly yearViews = computed<ProjectView[]>(() =>
    this.projects().flatMap((p) => projectView(p, this.year(), TEAM) ?? []),
  );

  protected readonly stats = computed(() => {
    const views = this.yearViews();
    return {
      projects: views.length,
      ready: views.filter((v) => v.readiness.status === 'READY').length,
      notReady: views.filter((v) => v.readiness.status === 'NOT_READY').length,
      needed: views.reduce((sum, v) => sum + v.readiness.totalNeeded, 0),
    };
  });

  protected readonly rows = computed(() => {
    const query = this.query().trim().toLowerCase();
    const filter = this.filter() as ProjectFilter;
    return this.yearViews().filter(
      (v) =>
        v.project.name.toLowerCase().includes(query) &&
        (filter === 'all' ||
          (filter === 'ready' && v.readiness.status === 'READY') ||
          (filter === 'notReady' && v.readiness.status === 'NOT_READY')),
    );
  });

  /** The chosen project if it is listed, otherwise the first listed one. */
  protected readonly selected = computed(() => this.rows().find((v) => v.project.id === this.selectedId()) ?? this.rows()[0]);
  protected readonly canMap = computed(() => {
    const project = this.selected()?.project;
    return !!project && mappableYears(project, CURRENT_YEAR).length > 0;
  });
  protected readonly isFiltered = computed(() => this.yearViews().length > 0 && this.rows().length === 0);

  protected select(id: number): void {
    this.creating.set(false);
    this.selectedId.set(id);
  }

  protected addRequirement(next: NewRequirement): void {
    this.updateSelected((py) =>
      isDuplicateRequirement(py.requirements, next.skillId, next.minLevel)
        ? py
        : { ...py, requirements: [...py.requirements, { id: this.nextRequirementId(), ...next }] },
    );
  }

  protected changeLevel({ requirementId, minLevel }: LevelChange): void {
    this.updateSelected((py) => {
      const target = py.requirements.find((r) => r.id === requirementId);
      if (!target || isDuplicateRequirement(py.requirements.filter((r) => r.id !== requirementId), target.skillId, minLevel)) return py;
      return { ...py, requirements: py.requirements.map((r) => (r.id === requirementId ? { ...r, minLevel } : r)) };
    });
  }

  protected changePeople({ requirementId, peopleRequired }: PeopleChange): void {
    if (!Number.isInteger(peopleRequired) || peopleRequired < 1) return;
    this.updateSelected((py) => ({
      ...py,
      requirements: py.requirements.map((r) => (r.id === requirementId ? { ...r, peopleRequired } : r)),
    }));
  }

  protected removeRequirement(requirementId: number): void {
    this.updateSelected((py) => ({ ...py, requirements: py.requirements.filter((r) => r.id !== requirementId) }));
  }

  protected assign(memberId: number): void {
    if (!TEAM.some((m) => m.id === memberId)) return;
    this.updateSelected(
      (py) => (py.assignedIds.includes(memberId) ? py : { ...py, assignedIds: [...py.assignedIds, memberId] }),
      this.assignmentsEditable(),
    );
  }

  protected unassign(memberId: number): void {
    this.updateSelected((py) => ({ ...py, assignedIds: py.assignedIds.filter((id) => id !== memberId) }), this.assignmentsEditable());
  }

  protected mapYear(target: number): void {
    const project = this.selected()?.project;
    if (!project || !mappableYears(project, CURRENT_YEAR).includes(target)) return;
    const next = carryForward(latestYear(project), target);
    this.projects.update((list) => list.map((p) => (p.id === project.id ? { ...p, years: [...p.years, next] } : p)));
    this.query.set('');
    this.filter.set('all');
    this.selectedId.set(project.id);
    this.year.set(target);
  }

  protected createProject(draft: NewProject): void {
    const name = normalizeText(draft.name);
    if (!name || (draft.year !== CURRENT_YEAR && draft.year !== CURRENT_YEAR + 1)) return;
    let nextId = this.nextRequirementId();
    const requirements: Requirement[] = [];
    for (const r of draft.requirements) {
      if (!isDuplicateRequirement(requirements, r.skillId, r.minLevel)) requirements.push({ id: nextId++, ...r });
    }
    const id = Math.max(0, ...this.projects().map((p) => p.id)) + 1;
    const project: Project = {
      id,
      name,
      description: draft.description,
      createdYear: draft.year,
      years: [{ year: draft.year, requirements, assignedIds: draft.year === CURRENT_YEAR ? draft.assignedIds : [] }],
    };
    this.projects.update((list) => [...list, project]);
    this.query.set('');
    this.filter.set('all');
    this.year.set(draft.year);
    this.selectedId.set(id);
    this.creating.set(false);
  }

  private nextRequirementId(): number {
    return 1 + Math.max(0, ...this.projects().flatMap((p) => p.years.flatMap((y) => y.requirements.map((r) => r.id))));
  }

  /** Apply a change to the selected project's data for the shown year, unless that is not allowed. */
  private updateSelected(change: (year: ProjectYear) => ProjectYear, allowed = this.requirementsEditable()): void {
    const view = this.selected();
    if (!view || !allowed) return;
    const { project } = view;
    const shown = this.year();
    if (!yearOf(project, shown)) return;
    this.projects.update((list) =>
      list.map((p) => (p.id === project.id ? { ...p, years: p.years.map((y) => (y.year === shown ? change(y) : y)) } : p)),
    );
  }
}
