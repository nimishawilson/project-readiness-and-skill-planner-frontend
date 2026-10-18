import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Selectable row. Content is projected into a grid; `template` must match the `app-list-header`
 * above it. Activates on click, Enter and Space.
 */
@Component({
  selector: 'app-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './list-item.scss',
  host: {
    role: 'button',
    tabindex: '0',
    '[attr.aria-pressed]': 'selected()',
    '[class.app-list-item--selected]': 'selected()',
    '[style.grid-template-columns]': 'template()',
    '(click)': 'activate.emit()',
    '(keydown.enter)': 'activate.emit()',
    '(keydown.space)': 'onSpace($event)',
  },
})
export class ListItem {
  readonly selected = input(false);
  readonly template = input.required<string>();
  readonly activate = output<void>();

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.activate.emit();
  }
}
