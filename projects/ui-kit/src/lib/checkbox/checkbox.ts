import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/**
 * Native checkbox. Use `[(checked)]`. `indeterminate` shows the dash of a partial "select all";
 * a click on it checks the box.
 */
@Component({
  selector: 'app-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="checkbox"
      [attr.aria-label]="label()"
      [checked]="checked()"
      [indeterminate]="indeterminate()"
      [disabled]="disabled()"
      (change)="onChange($event)"
    />
  `,
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  readonly checked = model(false);
  /** Partial selection (some, not all). Display only; `checked` stays as set. */
  readonly indeterminate = input(false);
  /** Accessible name (there is no visible label), e.g. "Select Arjun Mehta". */
  readonly label = input.required<string>();
  readonly disabled = input(false);

  protected onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
