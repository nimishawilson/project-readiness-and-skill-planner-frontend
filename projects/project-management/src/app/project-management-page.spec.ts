import { TestBed } from '@angular/core/testing';
import { CURRENT_YEAR } from './project-management.mock';
import { ProjectManagementPage } from './project-management-page';

describe('ProjectManagementPage', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [ProjectManagementPage] });
    const fixture = TestBed.createComponent(ProjectManagementPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const text = () => el.textContent ?? '';
    const rows = () => Array.from(el.querySelectorAll<HTMLElement>('app-project-list app-list-item'));
    const stat = (label: string) =>
      Array.from(el.querySelectorAll('app-stat-card')).find((c) => c.textContent?.includes(label))?.textContent ?? '';
    const byLabel = (label: string) => el.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
    const buttonText = (name: string, root: ParentNode = el) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(name));
    const click = (target: HTMLElement | null | undefined) => {
      target!.click();
      fixture.detectChanges();
    };
    const selectRow = (name: string) => click(rows().find((r) => r.textContent?.includes(name)));
    const type = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const choose = (select: HTMLSelectElement, value: string) => {
      select.value = value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const setYear = (year: number) => choose(el.querySelector<HTMLSelectElement>('app-page-header select')!, String(year));
    const tableRows = () => Array.from(el.querySelectorAll<HTMLElement>('app-requirements-table tbody tr'));
    const adder = () => el.querySelector<HTMLElement>('app-project-detail app-requirement-adder')!;
    return { fixture, el, text, rows, stat, byLabel, buttonText, click, selectRow, type, choose, setYear, tableRows, adder };
  }

  it('lists the current year projects with stats and the first one selected', () => {
    const { rows, stat, text } = setup();
    expect(rows().length).toBe(3);
    expect(stat('Projects')).toContain('3');
    expect(stat('Ready to start')).toContain('1');
    expect(stat('Not ready to start')).toContain('2');
    expect(stat('Qualified people still needed')).toContain('4');
    expect(text()).toContain('Merchant Analytics Dashboard');
    expect(text()).toContain('Every skill requirement has enough qualified people assigned.');
  });

  it('shows what is missing for a not ready project', () => {
    const { selectRow, text, rows } = setup();
    selectRow('Refunds Service v2');
    expect(text()).toContain('1 more qualified person needed across 1 requirement: Java Intermediate+ (1).');
    expect(rows().find((r) => r.textContent?.includes('Refunds'))?.textContent).toContain('+1 qualified needed');
  });

  it('filters by chip and by search', () => {
    const { el, rows, click, type } = setup();
    click(Array.from(el.querySelectorAll<HTMLButtonElement>('app-filter-chips button')).find((b) => b.textContent?.includes('Not ready')));
    expect(rows().length).toBe(2);
    click(Array.from(el.querySelectorAll<HTMLButtonElement>('app-filter-chips button')).find((b) => b.textContent?.includes('Ready to start')));
    expect(rows().length).toBe(1);
    click(Array.from(el.querySelectorAll<HTMLButtonElement>('app-filter-chips button')).find((b) => b.textContent?.trim() === 'All'));
    type(el.querySelector<HTMLInputElement>('app-search-input input')!, 'refunds');
    expect(rows().length).toBe(1);
    type(el.querySelector<HTMLInputElement>('app-search-input input')!, 'zzz');
    expect(el.textContent).toContain('No projects match your search.');
  });

  it('assigning a person who closes the gap makes the project ready', () => {
    const { selectRow, text, byLabel, click, stat } = setup();
    selectRow('Refunds Service v2');
    expect(text()).toContain('Would cover: Java Intermediate+');
    click(byLabel('Assign Daniel Thomas'));
    expect(stat('Not ready to start')).toContain('1');
    expect(stat('Qualified people still needed')).toContain('3');
    expect(text()).toContain('Daniel Thomas');
    expect(byLabel('Unassign Daniel Thomas')).not.toBeNull();
  });

  it('unassigning reduces qualified people and can make a project not ready', () => {
    const { byLabel, click, stat } = setup();
    click(byLabel('Unassign Rahul Iyer'));
    expect(stat('Ready to start')).toContain('0');
    // Rahul was the only Angular expert and one of two TypeScript people.
    expect(stat('Qualified people still needed')).toContain('6');
  });

  it('steps people needed and removes a requirement', () => {
    const { selectRow, byLabel, click, tableRows, stat } = setup();
    selectRow('Payments Checkout Revamp');
    click(byLabel('Increase Angular people needed'));
    expect(stat('Ready to start')).toContain('0');
    expect(stat('Qualified people still needed')).toContain('5');
    click(byLabel('Remove Angular requirement'));
    expect(tableRows().length).toBe(2);
    expect(stat('Ready to start')).toContain('1');
  });

  it('adds a requirement and rejects the same skill and level', () => {
    const { selectRow, adder, choose, click, tableRows, text, buttonText } = setup();
    selectRow('Payments Checkout Revamp');
    const selects = () => adder().querySelectorAll<HTMLSelectElement>('select');
    choose(selects()[0], '4');
    choose(selects()[1], 'BEGINNER');
    click(buttonText('Add requirement', adder()));
    expect(tableRows().length).toBe(4);
    expect(text()).toContain('Java');
    expect(adder().textContent).toContain('Java Beginner+ is already a requirement. Update it instead.');
    expect(buttonText('Add requirement', adder())!.disabled).toBe(true);
    choose(selects()[1], 'EXPERT');
    expect(buttonText('Add requirement', adder())!.disabled).toBe(false);
  });

  it('keeps the old level when a change would repeat a skill and level', () => {
    const { selectRow, click, choose, el, tableRows, buttonText, adder } = setup();
    selectRow('Payments Checkout Revamp');
    const selects = () => adder().querySelectorAll<HTMLSelectElement>('select');
    choose(selects()[0], '1');
    choose(selects()[1], 'BEGINNER');
    click(buttonText('Add requirement', adder()));
    expect(tableRows().length).toBe(4);
    const angularLevels = el.querySelectorAll<HTMLSelectElement>('select[aria-label="Angular minimum level"]');
    expect(angularLevels.length).toBe(2);
    choose(angularLevels[1], 'EXPERT');
    expect(el.querySelector('app-requirements-table .conflict')?.textContent).toContain('Angular Expert+ is already a requirement');
    expect(el.querySelectorAll<HTMLSelectElement>('select[aria-label="Angular minimum level"]')[1].value).toBe('BEGINNER');
  });

  it('creates a project from the form with a live readiness preview', () => {
    const { el, click, buttonText, type, choose, text, rows, stat } = setup();
    click(buttonText('New project'));
    const form = el.querySelector<HTMLElement>('app-project-form')!;
    expect(form.textContent).toContain('Will be created as: Ready to start');
    expect(form.textContent).toContain('Add skill requirements to track readiness.');
    expect(buttonText('Create project', form)!.disabled).toBe(true);

    choose(form.querySelector<HTMLSelectElement>('app-requirement-adder select')!, '5');
    click(buttonText('Add', form.querySelector<HTMLElement>('app-requirement-adder')!));
    expect(form.textContent).toContain('Will be created as: Not ready to start');
    expect(form.textContent).toContain('Python Intermediate+ (1)');

    click(form.querySelector<HTMLInputElement>('input[aria-label="Kavya Reddy"]'));
    expect(form.textContent).toContain('Will be created as: Ready to start');

    type(form.querySelector<HTMLInputElement>('input[type=text]')!, '  Partner   Portal ');
    click(buttonText('Create project', form));
    expect(el.querySelector('app-project-form')).toBeNull();
    expect(rows().length).toBe(4);
    expect(text()).toContain('Partner Portal');
    expect(stat('Projects')).toContain('4');
  });

  it('cancels the form', () => {
    const { el, click, buttonText } = setup();
    click(buttonText('New project'));
    click(buttonText('Cancel', el.querySelector<HTMLElement>('app-project-form')!));
    expect(el.querySelector('app-project-form')).toBeNull();
    expect(el.querySelector('app-project-detail')).not.toBeNull();
  });

  it('maps a project to the next year, carrying requirements and people forward', () => {
    const { el, click, buttonText, text, rows, stat, selectRow } = setup();
    selectRow('Payments Checkout Revamp');
    click(buttonText('Map to another year'));
    const dialog = el.querySelector<HTMLElement>('app-map-year-dialog')!;
    expect(dialog.textContent).toContain('3 skill requirements copied');
    expect(dialog.textContent).toContain('2 assigned employees carried forward');
    const years = Array.from(dialog.querySelectorAll('option')).map((o) => o.textContent?.trim());
    expect(years).toEqual([String(CURRENT_YEAR + 1), String(CURRENT_YEAR + 2), String(CURRENT_YEAR + 3)]);
    click(buttonText(`Map to ${CURRENT_YEAR + 1}`, dialog));
    expect(rows().length).toBe(1);
    expect(stat('Projects')).toContain('1');
    expect(text()).toContain(`Carried forward from Payments Checkout Revamp ${CURRENT_YEAR}`);
  });

  it('makes a future year plannable but not assignable', () => {
    const { el, click, buttonText, selectRow, setYear, text, byLabel } = setup();
    selectRow('Payments Checkout Revamp');
    click(buttonText('Map to another year'));
    click(buttonText(`Map to ${CURRENT_YEAR + 1}`, el.querySelector<HTMLElement>('app-map-year-dialog')!));
    expect(text()).toContain(`Assigning people opens when ${CURRENT_YEAR + 1} starts.`);
    expect(byLabel('Remove Angular requirement')).not.toBeNull();
    expect(byLabel('Unassign Rahul Iyer')).toBeNull();
    setYear(CURRENT_YEAR);
    expect(byLabel('Unassign Rahul Iyer')).not.toBeNull();
  });

  it('makes a past year read only', () => {
    const { el, setYear, text, byLabel, rows } = setup();
    setYear(CURRENT_YEAR - 1);
    expect(rows().length).toBe(1);
    expect(text()).toContain('Legacy Billing Migration');
    expect(el.querySelector('app-requirement-adder')).toBeNull();
    expect(el.querySelector('app-assign-candidates')).toBeNull();
    expect(byLabel('Unassign Daniel Thomas')).toBeNull();
    expect(byLabel('Remove Java requirement')).toBeNull();
  });

  it('shows an empty state for a year without projects', () => {
    const { setYear, text, rows } = setup();
    setYear(CURRENT_YEAR + 1);
    expect(rows().length).toBe(0);
    expect(text()).toContain(`No projects in ${CURRENT_YEAR + 1}`);
    expect(text()).toContain(`No projects mapped to ${CURRENT_YEAR + 1} yet.`);
  });
});
