import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Two cards side by side (stacked on narrow screens): the list in `master`, the selection in `detail`.
 * `masterHeight` (any CSS length) caps the list card so its content scrolls inside it.
 * `masterWidth` (any CSS length) fixes the list column and gives the rest to the detail; unset keeps the list wider (1.4 : 1).
 */
@Component({
  selector: 'app-master-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pane master"><ng-content select="[master]" /></section>
    <section class="pane detail"><ng-content select="[detail]" /></section>
  `,
  styleUrl: './master-detail.scss',
  host: {
    '[style.--app-master-height]': 'masterHeight()',
    '[style.--app-master-columns]': 'columns()',
  },
})
export class MasterDetail {
  readonly masterHeight = input<string>();
  readonly masterWidth = input<string>();

  protected readonly columns = computed(() =>
    this.masterWidth() ? `minmax(0, ${this.masterWidth()}) minmax(0, 1fr)` : null,
  );
}
