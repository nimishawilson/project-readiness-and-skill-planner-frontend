import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Nav } from './nav';

describe('Nav', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [Nav], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Nav);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the four links', () => {
    const { el } = setup();
    const links = Array.from(el.querySelectorAll('.nav__link'));
    expect(links.map((a) => a.textContent?.trim())).toEqual([
      'Employees',
      'Skill matrix',
      'Learning goals',
      'Projects',
    ]);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/employees',
      '/skills',
      '/learning-goals',
      '/projects',
    ]);
  });

  it('shows the user name, designation and initials', () => {
    const { el } = setup();
    expect(el.querySelector('.nav__user-name')?.textContent).toContain('Priya Nair');
    expect(el.querySelector('.nav__user-role')?.textContent).toContain('Engineering Manager');
    expect(el.querySelector('app-avatar')?.textContent).toContain('PN');
  });

  it('opens the menu on click and closes it on Escape and outside click', () => {
    const { fixture, el } = setup();
    const open = () => !!el.querySelector('.nav__menu');

    (el.querySelector('.nav__user-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(open()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(open()).toBe(false);

    (el.querySelector('.nav__user-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(open()).toBe(false);
  });
});
