import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A tinted notice panel. `info` is neutral (limits, read-only notes); `warning` draws attention
 * (items waiting on the user); `success` confirms a good state (e.g. ready to start). Put an icon in the `[icon]` slot and the message as content.
 */
@Component({
  selector: 'app-callout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="icon"><ng-content select="[icon]" /></span>
    <div class="body"><ng-content /></div>
  `,
  styleUrl: './callout.scss',
  host: { '[class]': '"app-callout--" + variant()' },
})
export class Callout {
  readonly variant = input<'info' | 'warning' | 'success'>('info');
}
