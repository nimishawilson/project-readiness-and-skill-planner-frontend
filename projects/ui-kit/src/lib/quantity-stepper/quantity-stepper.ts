import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { stepValue } from './quantity-stepper.utils';

/** − n + control for a small whole number, e.g. people required. Use `[(value)]`. */
@Component({
  selector: 'app-quantity-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [attr.aria-label]="'Decrease ' + label()" [disabled]="disabled() || value() <= min()" (click)="step(-1)">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
    </button>
    <output [attr.aria-label]="label()">{{ value() }}</output>
    <button type="button" [attr.aria-label]="'Increase ' + label()" [disabled]="disabled() || value() >= max()" (click)="step(1)">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" /></svg>
    </button>
  `,
  styleUrl: './quantity-stepper.scss',
})
export class QuantityStepper {
  readonly value = model(1);
  /** What is counted, e.g. "Angular people needed". Used in the button names. */
  readonly label = input.required<string>();
  readonly min = input(1);
  readonly max = input(1000);
  readonly disabled = input(false);

  protected step(delta: number): void {
    this.value.set(stepValue(this.value(), delta, this.min(), this.max()));
  }
}
