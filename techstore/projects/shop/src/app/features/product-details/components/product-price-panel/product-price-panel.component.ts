import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ButtonComponent,
  PriceTagComponent,
  StockBadgeComponent,
} from '@techstore/design-system';
import type { ProductAvailabilityStatus, ProductPrice } from '../../../../core/models/commerce.model';

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
  readonly availabilityStatus = input.required<ProductAvailabilityStatus>();
  readonly quantity = input.required<number | null>();
  readonly canAddToCart = input.required<boolean>();
  readonly addToCart = output<void>();
}
