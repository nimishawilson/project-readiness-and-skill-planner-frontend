import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Two cards side by side (stacked on narrow screens): the list in `master`, the selection in `detail`.
 * `masterHeight` (any CSS length) caps the list card so its content scrolls inside it.
 */
@Component({
  selector: 'app-master-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pane master"><ng-content select="[master]" /></section>
    <section class="pane detail"><ng-content select="[detail]" /></section>
  `,
  styleUrl: './master-detail.scss',
  host: { '[style.--app-master-height]': 'masterHeight()' },
})
export class MasterDetail {
  readonly masterHeight = input<string>();
}
