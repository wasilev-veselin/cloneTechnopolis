import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeComponent, type BadgeTone } from '../../primitives/badge/badge.component';

export type StockStatus = 'inStock' | 'limited' | 'outOfStock' | 'preorder' | 'onlineOnly';

@Component({
  selector: 'ts-stock-badge',
  imports: [BadgeComponent],
  templateUrl: './stock-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockBadgeComponent {
  readonly status = input.required<StockStatus>();

  protected readonly label = computed(() => {
    const labels: Record<StockStatus, string> = {
      inStock: 'В наличност',
      limited: 'Ограничено',
      outOfStock: 'Изчерпан',
      preorder: 'Предварителна поръчка',
      onlineOnly: 'Само онлайн',
    };

    return labels[this.status()];
  });

  protected readonly tone = computed<BadgeTone>(() => {
    const tones: Record<StockStatus, BadgeTone> = {
      inStock: 'success',
      limited: 'warning',
      outOfStock: 'danger',
      preorder: 'warning',
      onlineOnly: 'neutral',
    };

    return tones[this.status()];
  });
}
