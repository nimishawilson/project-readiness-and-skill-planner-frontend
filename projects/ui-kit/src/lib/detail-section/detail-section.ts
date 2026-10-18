import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Titled block inside a detail panel: heading on the left, optional `meta` on the right, then the body. */
@Component({
  selector: 'app-detail-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h3>{{ heading() }}</h3>
      <span class="meta"><ng-content select="[meta]" /></span>
    </header>
    <ng-content />
  `,
  styleUrl: './detail-section.scss',
})
export class DetailSection {
  readonly heading = input.required<string>();
}
