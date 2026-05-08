import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PriceTagComponent } from '@techstore/design-system';
import { CartStore } from '../../../cart/store/cart.store';

@Component({
  selector: 'app-order-summary',
  imports: [PriceTagComponent],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
  protected readonly cartStore = inject(CartStore);
}
