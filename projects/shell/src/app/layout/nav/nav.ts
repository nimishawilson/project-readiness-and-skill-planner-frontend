import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Avatar } from '@app/ui-kit';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class Nav {
  protected readonly links: NavLink[] = [
    { label: 'Employees', path: '/employees' },
    { label: 'Skill matrix', path: '/skills' },
    { label: 'Learning goals', path: '/learning-goals' },
    { label: 'Projects', path: '/projects' },
  ];

  // Static for now; to be replaced by the signed-in user.
  protected readonly user = signal({ name: 'Priya Nair', designation: 'Engineering Manager' });
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onDocumentClick(event: Event): void {
    const target = event.target as Element | null;
    if (!target?.closest('.nav__user')) {
      this.closeMenu();
    }
  }

  protected logout(): void {
    // TODO: wire to auth once login exists.
    this.closeMenu();
  }
}
