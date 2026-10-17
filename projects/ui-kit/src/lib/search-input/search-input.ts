import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

/**
 * Text field with a magnifier icon and a placeholder (e.g. "Search my team").
 * Two-way bind `value` for instant filtering; listen to `searchChange` for a
 * debounced value (server-side search). Shows a clear button when it has text.
 */
@Component({
  selector: 'app-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="field">
      <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="m20 20-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input
        #field
        type="search"
        [attr.aria-label]="label()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInput($event)"
        (keydown.enter)="flush()"
        (keydown.escape)="clear()"
      />
      @if (value() && !disabled()) {
        <button type="button" class="clear" aria-label="Clear search" (click)="clear()">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      }
    </span>
  `,
  styleUrl: './search-input.scss',
})
export class SearchInput {
  /** Current text. Updates on every keystroke; use `[(value)]`. */
  readonly value = model('');
  /** Hint shown when empty, e.g. "Search projects". */
  readonly placeholder = input('Search');
  /** Accessible name (there is no visible label; a placeholder is not a label). */
  readonly label = input.required<string>();
  /** Pause in ms after the last keystroke before `searchChange` fires. */
  readonly debounce = input(250);
  readonly disabled = input(false);
  /** Debounced text; fires at once on clear and on Enter. */
  readonly searchChange = output<string>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.searchChange.emit(this.value()), this.debounce());
  }

  protected flush(): void {
    clearTimeout(this.timer);
    this.searchChange.emit(this.value());
  }

  protected clear(): void {
    if (!this.value()) return;
    this.value.set('');
    this.flush();
    this.field().nativeElement.focus();
  }
}
