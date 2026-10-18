import { TestBed } from '@angular/core/testing';
import { CURRENT_YEAR } from './learning-goals.mock';
import { LearningGoalsPage } from './learning-goals-page';

describe('LearningGoalsPage', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [LearningGoalsPage] });
    const fixture = TestBed.createComponent(LearningGoalsPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const text = () => el.textContent ?? '';
    const rows = () => Array.from(el.querySelectorAll<HTMLElement>('app-list-item'));
    const stat = (label: string) =>
      Array.from(el.querySelectorAll('app-stat-card')).find((c) => c.textContent?.includes(label))?.textContent ?? '';
    const button = (name: string, root: ParentNode = el) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim().includes(name));
    const click = (target: HTMLElement | undefined) => {
      target!.click();
      fixture.detectChanges();
    };
    const selectRow = (name: string) => click(rows().find((r) => r.textContent?.includes(name)));
    const setYear = (year: number) => {
      const select = el.querySelector<HTMLSelectElement>('select')!;
      select.value = String(year);
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const type = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { fixture, el, text, rows, stat, button, click, selectRow, setYear, type };
  }

  it('shows the team, stats, banner and the first member selected', () => {
    const { rows, stat, text, el } = setup();
    expect(rows().length).toBe(6);
    expect(stat('Awaiting approval')).toContain('3');
    expect(stat('In progress')).toContain('3');
    expect(stat('Not started')).toContain('1');
    expect(stat('Approved')).toContain('2');
    expect(el.querySelector('app-approval-banner')?.textContent).toContain('3 completed goals');
    expect(text()).toContain('Arjun Mehta');
    expect(text()).toContain('Yearly limit reached.');
  });

  it('approves from the banner and updates stats and the banner', () => {
    const { el, button, click, stat } = setup();
    const banner = el.querySelector<HTMLElement>('app-approval-banner')!;
    click(button('Approve', banner));
    expect(stat('Awaiting approval')).toContain('2');
    expect(stat('Approved')).toContain('3');
    expect(banner.textContent).toContain('2 completed goals');
  });

  it('sends a completed goal back to in progress', () => {
    const { el, button, click, stat } = setup();
    click(button('Send back', el.querySelector<HTMLElement>('app-approval-banner')!));
    expect(stat('Awaiting approval')).toContain('2');
    expect(stat('In progress')).toContain('4');
  });

  it('locks progress on approved goals', () => {
    const { el } = setup();
    const approved = Array.from(el.querySelectorAll('app-member-goals app-goal-card')).find((c) =>
      c.textContent?.includes('Kafka Streams'),
    )!;
    expect(approved.textContent).toContain('Progress is locked after approval.');
    expect(approved.querySelector<HTMLButtonElement>('[role=radio]')!.disabled).toBe(true);
  });

  it('changes progress on an editable goal', () => {
    const { el, click, stat } = setup();
    const goal = Array.from(el.querySelectorAll('app-member-goals app-goal-card')).find((c) =>
      c.textContent?.includes('Lead one architecture review'),
    )!;
    click(Array.from(goal.querySelectorAll<HTMLButtonElement>('[role=radio]')).find((b) => b.textContent?.includes('Completed')));
    expect(stat('Awaiting approval')).toContain('4');
  });

  it('filters the team by search and by chip', () => {
    const { rows, el, click, fixture, type } = setup();
    type(el.querySelector<HTMLInputElement>('app-search-input input')!, 'iyer');
    expect(rows().length).toBe(1);
    type(el.querySelector<HTMLInputElement>('app-search-input input')!, 'nobody');
    expect(el.textContent).toContain('No team members match your search.');
    type(el.querySelector<HTMLInputElement>('app-search-input input')!, '');
    click(Array.from(el.querySelectorAll<HTMLButtonElement>('app-filter-chips button')).find((b) => b.textContent?.includes('Awaiting')));
    expect(rows().length).toBe(2);
    click(Array.from(el.querySelectorAll<HTMLButtonElement>('app-filter-chips button')).find((b) => b.textContent?.includes('open slots')));
    expect(rows().length).toBe(5);
    fixture.detectChanges();
  });

  it('assigns goals for a member with open slots until the limit is reached', () => {
    const { el, selectRow, type, click, button, text } = setup();
    selectRow('Kavya Reddy');
    expect(text()).toContain('1 slot left for ' + CURRENT_YEAR);
    const assign = () => button('Assign goal')!;
    expect(assign().disabled).toBe(true);
    type(el.querySelector<HTMLInputElement>('app-assign-goal-form input')!, '  Learn   Rust ');
    expect(assign().disabled).toBe(false);
    click(assign());
    expect(text()).toContain('Learn Rust');
    expect(text()).toContain('Yearly limit reached.');
    expect(text()).toContain('Kavya already has 3 goals');
  });

  it('shows a member with no goals and an empty message', () => {
    const { selectRow, text } = setup();
    selectRow('Daniel Thomas');
    expect(text()).toContain('No learning goals for ' + CURRENT_YEAR + ' yet.');
    expect(text()).toContain('3 slots left');
  });

  it('makes the previous year read only, with no banner and an ended notice', () => {
    const { setYear, el, text, stat } = setup();
    setYear(CURRENT_YEAR - 1);
    expect(stat('Awaiting approval')).toContain('0');
    expect(stat('Approved')).toContain('2');
    expect(el.querySelector('app-approval-banner')).toBeNull();
    expect(text()).toContain(`${CURRENT_YEAR - 1} has ended.`);
    expect(el.querySelector('app-assign-goal-form form')).toBeNull();
  });

  it('allows assigning for next year', () => {
    const { setYear, el, text } = setup();
    setYear(CURRENT_YEAR + 1);
    expect(el.querySelector('app-assign-goal-form form')).not.toBeNull();
    expect(text()).toContain('3 slots left for ' + (CURRENT_YEAR + 1));
  });
});
