import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ts-price-tag',
  imports: [CurrencyPipe],
  templateUrl: './price-tag.component.html',
  styleUrl: './price-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTagComponent {
  readonly amount = input.required<number>();
  readonly currencyCode = input('BGN');
}
