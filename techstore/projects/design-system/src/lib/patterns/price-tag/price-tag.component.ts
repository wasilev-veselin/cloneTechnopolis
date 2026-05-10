import { DecimalPipe, getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ts-price-tag',
  imports: [DecimalPipe],
  templateUrl: './price-tag.component.html',
  styleUrl: './price-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTagComponent {
  readonly amount = input.required<number>();
  readonly currencyCode = input.required<string>();
  readonly currencySymbol = computed(() => getCurrencySymbol(this.currencyCode(), 'narrow'));
}
