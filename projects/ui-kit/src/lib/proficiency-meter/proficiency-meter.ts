import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  PROFICIENCY_SEGMENTS,
  ProficiencyValue,
  proficiencyLabel,
  segmentsFor,
} from '../proficiency-select/proficiency.utils';

/** Three-segment bar showing a proficiency level (Beginner 1, Intermediate 2, Expert 3). */
@Component({
  selector: 'app-proficiency-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (on of segments(); track $index) {
      <span [class.on]="on"></span>
    }
  `,
  styleUrl: './proficiency-meter.scss',
  host: { role: 'img', '[attr.aria-label]': 'text()' },
})
export class ProficiencyMeter {
  readonly level = input.required<ProficiencyValue>();

  protected readonly segments = computed(() => {
    const filled = segmentsFor(this.level());
    return Array.from({ length: PROFICIENCY_SEGMENTS }, (_, i) => i < filled);
  });
  protected readonly text = computed(() => proficiencyLabel(this.level()));
}
