import { ChangeDetectionStrategy, Component, effect, ElementRef, input, model, viewChild } from '@angular/core';

let nextId = 0;

/**
 * Modal dialog on the native `<dialog>` (focus trap, Escape and top layer come from the browser).
 * Open and close with `[(open)]`. Clicking the backdrop or pressing Escape closes it. Put the message
 * in the content and buttons in `[actions]`.
 */
@Component({
  selector: 'app-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dlg [attr.aria-labelledby]="titleId" (close)="open.set(false)" (click)="onClick($event)">
      <div class="panel">
        <h2 [id]="titleId">{{ heading() }}</h2>
        <div class="body"><ng-content /></div>
        <div class="actions"><ng-content select="[actions]" /></div>
      </div>
    </dialog>
  `,
  styleUrl: './dialog.scss',
})
export class Dialog {
  readonly open = model(false);
  readonly heading = input.required<string>();

  protected readonly titleId = `app-dialog-title-${nextId++}`;
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const el = this.dialog()?.nativeElement;
      if (!el) return;
      if (this.open() && !el.open) {
        // jsdom has no showModal; fall back to the plain `open` attribute.
        if (typeof el.showModal === 'function') el.showModal();
        else el.setAttribute('open', '');
      } else if (!this.open() && el.open) {
        if (typeof el.close === 'function') el.close();
        else el.removeAttribute('open');
      }
    });
  }

  protected onClick(event: MouseEvent): void {
    // The dialog element itself is the backdrop area; the panel fills the rest.
    if (event.target === event.currentTarget) this.open.set(false);
  }
}
