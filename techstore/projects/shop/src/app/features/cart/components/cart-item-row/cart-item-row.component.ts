import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PriceTagComponent } from '@techstore/design-system';
import type { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-item-row',
  imports: [PriceTagComponent],
  templateUrl: './cart-item-row.component.html',
  styleUrl: './cart-item-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemRowComponent {
  readonly item = input.required<CartItem>();
  readonly remove = output<string>();
}
