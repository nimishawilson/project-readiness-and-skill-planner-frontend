import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormField } from '../form-field/form-field';

/** Labelled native dropdown of years (goal year, project year). Use `[(value)]`. */
@Component({
  selector: 'app-year-select',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-form-field [label]="label()">
      <select (change)="value.set(+$any($event.target).value)">
        @for (year of years(); track year) {
          <option [value]="year" [selected]="year === value()">{{ year }}</option>
        }
      </select>
    </app-form-field>
  `,
  styles: ':host { display: block; min-width: 120px; }',
})
export class YearSelect {
  readonly years = input.required<number[]>();
  readonly value = model.required<number>();
  readonly label = input('Year');
}
