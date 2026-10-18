import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md';

/**
 * Styles a native `<button>`: `<button app-button variant="outline">Save</button>`.
 * Icon-only buttons (`iconOnly`) must carry an `aria-label`; project the SVG as content.
 */
@Component({
  selector: 'button[app-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './button.scss',
  host: {
    '[class]': '"app-button--" + variant() + " app-button--" + size()',
    '[class.app-button--icon]': 'iconOnly()',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  /** Square button holding only an icon. */
  readonly iconOnly = input(false);
}
