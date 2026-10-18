import { TestBed } from '@angular/core/testing';
import { SkillsMatrixPage } from './skills-matrix-page';

describe('SkillsMatrixPage', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [SkillsMatrixPage] });
    const fixture = TestBed.createComponent(SkillsMatrixPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const text = () => el.textContent ?? '';
    const rows = () => Array.from(el.querySelectorAll<HTMLElement>('tbody tr'));
    const rowBox = (i: number) => rows()[i].querySelector<HTMLInputElement>('th input[type=checkbox]')!;
    const selectAll = () => el.querySelector<HTMLInputElement>('thead input[type=checkbox]')!;
    const cell = (row: number, col: number) => rows()[row].querySelectorAll<HTMLSelectElement>('td select')[col];
    const click = (node: HTMLElement) => {
      node.click();
      fixture.detectChanges();
    };
    const pick = (select: HTMLSelectElement, value: string) => {
      select.value = value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const heading = (name: string) =>
      Array.from(el.querySelectorAll<HTMLButtonElement>('thead .skill-heading')).find((b) => b.textContent?.trim() === name)!;
    const applyButton = () =>
      Array.from(el.querySelectorAll<HTMLButtonElement>('app-bulk-update-bar button')).find((b) => b.textContent?.includes('Apply'))!;
    return { fixture, el, text, rows, rowBox, selectAll, cell, click, pick, heading, applyButton };
  }

  it('shows the team matrix with coverage and nothing selected', () => {
    const { text, rows, el, applyButton } = setup();
    expect(rows().length).toBe(6);
    expect(el.querySelectorAll('thead .skill-heading').length).toBe(8);
    expect(text()).toContain('No one selected');
    expect(text()).toContain('1 Exp · 1 Int · 1 Beg');
    expect(applyButton().disabled).toBe(true);
  });

  it('filters rows by search without changing coverage', () => {
    const { fixture, rows, el, text } = setup();
    const input = el.querySelector<HTMLInputElement>('app-search-input input')!;
    input.value = 'iyer';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rows().length).toBe(1);
    expect(text()).toContain('1 Exp · 1 Int · 1 Beg');
  });

  it('shows an empty state when nobody matches', () => {
    const { fixture, el, text } = setup();
    const input = el.querySelector<HTMLInputElement>('app-search-input input')!;
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(text()).toContain('No one matches');
  });

  it('select-all is tri-state over the rows', () => {
    const { rowBox, selectAll, click, text } = setup();
    click(rowBox(0));
    expect(text()).toContain('1 selected');
    expect(selectAll().indeterminate).toBe(true);
    click(selectAll());
    expect(text()).toContain('6 selected');
    expect(selectAll().checked).toBe(true);
    click(selectAll());
    expect(text()).toContain('No one selected');
  });

  it('targets a skill from its heading and un-targets it on a second click', () => {
    const { heading, click, el } = setup();
    click(heading('Angular'));
    expect(el.querySelector<HTMLSelectElement>('app-bulk-update-bar select')!.value).toBe('1');
    expect(heading('Angular').getAttribute('aria-pressed')).toBe('true');
    click(heading('Angular'));
    expect(heading('Angular').getAttribute('aria-pressed')).toBe('false');
  });

  it('applies a level to the ticked rows, then clears the ticks but keeps the skill', () => {
    const { rowBox, heading, click, pick, cell, applyButton, text, el } = setup();
    click(rowBox(1)); // Kavya, Angular not assessed
    click(rowBox(2)); // Rahul, Angular expert
    click(heading('Angular'));
    pick(el.querySelectorAll<HTMLSelectElement>('app-bulk-update-bar select')[1], 'INTERMEDIATE');
    expect(text()).toContain('Highlighted cells will be set to Intermediate.');
    expect(applyButton().disabled).toBe(false);

    click(applyButton());
    expect(cell(1, 0).value).toBe('INTERMEDIATE');
    expect(cell(2, 0).value).toBe('INTERMEDIATE');
    expect(cell(0, 0).value).toBe('INTERMEDIATE');
    expect(text()).toContain('No one selected');
    expect(heading('Angular').getAttribute('aria-pressed')).toBe('true');
    expect(text()).toContain('0 Exp · 3 Int · 1 Beg');
  });

  it('changes a single cell and updates coverage', () => {
    const { pick, cell, text } = setup();
    pick(cell(5, 0), 'EXPERT'); // Meera, Angular
    expect(cell(5, 0).value).toBe('EXPERT');
    expect(text()).toContain('2 Exp · 1 Int · 1 Beg');
  });
});
