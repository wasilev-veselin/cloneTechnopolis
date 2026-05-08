import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ts-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.success]': "tone() === 'success'",
    '[class.warning]': "tone() === 'warning'",
    '[class.danger]': "tone() === 'danger'",
  },
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
