import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceTagComponent, StockBadgeComponent } from '@techstore/design-system';
import type { ProductSummary } from '../../models/product-summary.model';

@Component({
  selector: 'app-product-card',
  imports: [PriceTagComponent, RouterLink, StockBadgeComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<ProductSummary>();
}
