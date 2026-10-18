import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Swatch style: `empty` is dashed, then `soft`, `medium` and `strong` match the proficiency cell colors. */
export type LegendTone = 'empty' | 'soft' | 'medium' | 'strong';

export interface LegendItem {
  label: string;
  tone: LegendTone;
}

/** Row of colored keys explaining a chart or grid, e.g. Not assessed / Beginner / Intermediate / Expert. */
@Component({
  selector: 'app-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.label) {
      <span class="item" role="listitem"><span class="swatch" [class]="'swatch tone-' + item.tone" aria-hidden="true"></span>{{ item.label }}</span>
    }
  `,
  styleUrl: './legend.scss',
  host: { role: 'list' },
})
export class Legend {
  readonly items = input.required<LegendItem[]>();
}
