import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ButtonComponent,
  PriceTagComponent,
  StockBadgeComponent,
} from '@techstore/design-system';
import type { ProductPrice, ProductStockStatus } from '../../../../core/models/commerce.model';

@Component({
  selector: 'app-product-price-panel',
  imports: [
    ButtonComponent,
    PriceTagComponent,
    StockBadgeComponent,
  ],
  templateUrl: './product-price-panel.component.html',
  styleUrl: './product-price-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPricePanelComponent {
  readonly price = input.required<ProductPrice>();
  readonly stockStatus = input.required<ProductStockStatus>();
  readonly quantity = input.required<number>();
  readonly addToCart = output<void>();
}
