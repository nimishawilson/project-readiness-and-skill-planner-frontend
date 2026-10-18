import { TestBed } from '@angular/core/testing';
import { EmployeeDirectoryPage } from './employee-directory-page';

describe('EmployeeDirectoryPage', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [EmployeeDirectoryPage] });
    const fixture = TestBed.createComponent(EmployeeDirectoryPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const rows = () => Array.from(el.querySelectorAll<HTMLElement>('app-list-item'));
    const text = () => el.textContent ?? '';
    return { fixture, el, rows, text };
  }

  it('lists all 12 employees with the empty state and stats', () => {
    const { rows, text } = setup();
    expect(rows().length).toBe(12);
    expect(text()).toContain('Showing 12 of 12 employees');
    expect(text()).toContain('Select an employee');
    expect(text()).toContain('on my team');
  });

  it('filters by department chip', () => {
    const { fixture, rows, text, el } = setup();
    const chip = Array.from(el.querySelectorAll<HTMLButtonElement>('app-filter-chips button')).find((b) =>
      b.textContent?.includes('Engineering'),
    )!;
    chip.click();
    fixture.detectChanges();
    expect(rows().length).toBe(5);
    expect(text()).toContain('Showing 5 of 12 employees');
  });

  it('filters by search text', async () => {
    const { fixture, rows, el } = setup();
    const input = el.querySelector<HTMLInputElement>('app-search-input input')!;
    input.value = 'iyer';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rows().map((r) => r.textContent)).toEqual([expect.stringContaining('Rahul Iyer')]);
  });

  it('opens an editable detail panel and closes it again', () => {
    const { fixture, rows, el, text } = setup();
    rows()[0].click();
    fixture.detectChanges();
    expect(el.querySelector('app-employee-detail h2')?.textContent).toContain('Arjun Mehta');
    expect(text()).toContain('My team · Can edit');
    expect(el.querySelector('app-skills-section form')).toBeTruthy();

    el.querySelector<HTMLButtonElement>('button[aria-label="Close details"]')!.click();
    fixture.detectChanges();
    expect(text()).toContain('Select an employee');
  });

  it('hides edit controls for a view-only employee', () => {
    const { fixture, rows, el, text } = setup();
    rows()[6].click(); // Vikram Shah, not on the team
    fixture.detectChanges();
    expect(text()).toContain('View only');
    expect(el.querySelector('app-skills-section form')).toBeNull();
    expect(el.querySelector('app-goals-section form')).toBeNull();
    expect(el.querySelector('app-skills-section button[aria-label^="Remove"]')).toBeNull();
  });
});
