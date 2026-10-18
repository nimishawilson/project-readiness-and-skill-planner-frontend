import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Placeholder for an empty pane: icon (project as `icon`), heading, message and optional skeleton lines. */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="icon" aria-hidden="true"><ng-content select="[icon]" /></div>
    <h2>{{ heading() }}</h2>
    @if (message()) {
      <p>{{ message() }}</p>
    }
    @if (skeleton()) {
      <div class="lines" aria-hidden="true"><span></span><span></span><span></span></div>
    }
  `,
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly heading = input.required<string>();
  readonly message = input<string>();
  /** Show grey placeholder lines under the message. */
  readonly skeleton = input(false);
}
