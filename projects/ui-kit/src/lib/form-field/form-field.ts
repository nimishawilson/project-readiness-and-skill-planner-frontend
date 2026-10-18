import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Label above a projected `<input>`, `<select>` or `<textarea>`, with optional hint or error text.
 * The label wraps the control so clicking it focuses the control.
 */
@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label>
      <span class="label">{{ label() }}</span>
      <ng-content />
    </label>
    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    } @else if (hint()) {
      <p class="hint">{{ hint() }}</p>
    }
  `,
  styleUrl: './form-field.scss',
})
export class FormField {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string>();
}
