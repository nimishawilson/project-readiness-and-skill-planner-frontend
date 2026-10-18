import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { initialsFrom } from './avatar.utils';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarTone = 'soft' | 'solid' | 'primary';

/**
 * Circle showing a person's initials, derived from their full name.
 * Use `decorative` when the name is already rendered next to it.
 */
@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ initials() }}`,
  styleUrl: './avatar.scss',
  host: {
    '[class]': '"app-avatar--" + size() + " app-avatar--" + tone()',
    '[attr.role]': 'decorative() ? null : "img"',
    '[attr.aria-label]': 'decorative() ? null : name()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class Avatar {
  /** Full name; the initials are derived from it. */
  readonly name = input.required<string>();
  /** Diameter: `sm` 24px, `md` 32px, `lg` 48px. */
  readonly size = input<AvatarSize>('md');
  /** `soft` is a tinted fill for light surfaces; `solid` is a stronger fill for dark surfaces; `primary` is the brand fill with light text. */
  readonly tone = input<AvatarTone>('soft');
  /** Hide from assistive technology (the name is shown as text nearby). */
  readonly decorative = input(false);

  protected readonly initials = computed(() => initialsFrom(this.name()));
}
