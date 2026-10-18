import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Page title and subtitle on the left; elements marked `actions` (e.g. stat cards) sit side by side on the right. Put the attribute on each element, not on a wrapper. */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text">
      <h1>{{ heading() }}</h1>
      @if (subtitle()) {
        <p>{{ subtitle() }}</p>
      }
    </div>
    <div class="actions"><ng-content select="[actions]" /></div>
  `,
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly subtitle = input<string>();
}
