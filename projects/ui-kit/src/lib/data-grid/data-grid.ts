import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface GridColumn {
  /** Unique key, passed to the cell templates. */
  key: string;
  /** Plain-text heading, used when no `appGridHeader` template is given. */
  header: string;
}

/** Context shared by the cell templates: `let-column` (and `let-row` where there is a row). */
export interface GridTemplateContext {
  $implicit: unknown;
  column?: GridColumn;
}

/** Top-left cell (e.g. a select-all checkbox and the "Employee" heading). */
@Directive({ selector: 'ng-template[appGridCorner]' })
export class GridCorner {
  readonly template = inject(TemplateRef);
}

/** Column heading. Context: `let-column`. */
@Directive({ selector: 'ng-template[appGridHeader]' })
export class GridHeader {
  readonly template = inject<TemplateRef<GridTemplateContext>>(TemplateRef);
}

/** First cell of every row. Context: `let-row`. */
@Directive({ selector: 'ng-template[appGridRowHeader]' })
export class GridRowHeader {
  readonly template = inject<TemplateRef<GridTemplateContext>>(TemplateRef);
}

/** Body cell. Context: `let-row` and `let-column="column"`. */
@Directive({ selector: 'ng-template[appGridCell]' })
export class GridCell {
  readonly template = inject<TemplateRef<GridTemplateContext>>(TemplateRef);
}

/** Bottom-left cell of the footer row. Giving it (or `appGridFooterCell`) turns the footer on. */
@Directive({ selector: 'ng-template[appGridFooterLabel]' })
export class GridFooterLabel {
  readonly template = inject(TemplateRef);
}

/** Footer cell under each column. Context: `let-column`. */
@Directive({ selector: 'ng-template[appGridFooterCell]' })
export class GridFooterCell {
  readonly template = inject<TemplateRef<GridTemplateContext>>(TemplateRef);
}

/**
 * Scrollable table that scales to any number of rows and columns. The column headings stay on top,
 * the footer row stays at the bottom and the first column stays on the left while the rest scrolls;
 * the corners are pinned on both axes. It only handles layout: the content of every cell comes from
 * projected `ng-template`s (`appGridCorner`, `appGridHeader`, `appGridRowHeader`, `appGridCell`,
 * `appGridFooterLabel`, `appGridFooterCell`).
 *
 * Give the grid a height (`maxHeight`, or a parent with a fixed height and `height: 100%`) for the
 * vertical scrolling to apply.
 */
@Component({
  selector: 'app-data-grid',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  host: {
    '[style.--app-grid-first-width]': 'firstColumnWidth()',
    '[style.--app-grid-column-min]': 'columnMinWidth()',
    '[style.--app-grid-max-height]': 'maxHeight()',
  },
})
export class DataGrid<T> {
  readonly columns = input.required<GridColumn[]>();
  readonly rows = input.required<T[]>();
  /** Unique, stable id of a row (used to keep rows in place when the list changes). */
  readonly rowKey = input.required<(row: T) => string | number>();
  /** Accessible name of the table. */
  readonly label = input.required<string>();
  /** CSS length of the sticky first column. */
  readonly firstColumnWidth = input('260px');
  /** CSS length: each other column never gets narrower than this; the grid scrolls sideways instead. */
  readonly columnMinWidth = input('120px');
  /** CSS length at which the grid starts scrolling vertically. Unset: grows to fit. */
  readonly maxHeight = input<string>();
  /** Key of a column to emphasize (tint). */
  readonly highlightColumn = input<string>();
  /** Rows for which this returns true are marked selected (accent edge and tint). */
  readonly isRowSelected = input<(row: T) => boolean>(() => false);

  protected readonly corner = contentChild(GridCorner);
  protected readonly header = contentChild(GridHeader);
  protected readonly rowHeader = contentChild(GridRowHeader);
  protected readonly cell = contentChild(GridCell);
  protected readonly footerLabel = contentChild(GridFooterLabel);
  protected readonly footerCell = contentChild(GridFooterCell);

  protected readonly hasFooter = computed(() => !!this.footerLabel() || !!this.footerCell());
  protected readonly minWidth = computed(
    () => `calc(var(--app-grid-first-width) + ${this.columns().length} * var(--app-grid-column-min))`,
  );
}
