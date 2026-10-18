import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Column headings for a list. `template` is a CSS `grid-template-columns` value and must match
 * the `template` given to every `app-list-item` below it so the columns line up.
 */
@Component({
  selector: 'app-list-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (column of columns(); track column) {
      <span>{{ column }}</span>
    }
  `,
  styleUrl: './list-header.scss',
  host: { '[style.grid-template-columns]': 'template()' },
})
export class ListHeader {
  readonly columns = input.required<string[]>();
  readonly template = input.required<string>();
}
