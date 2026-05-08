import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@techstore/design-system';
import { CartItemRowComponent } from '../../components/cart-item-row/cart-item-row.component';
import { CartSummaryPanelComponent } from '../../components/cart-summary-panel/cart-summary-panel.component';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [
    ButtonComponent,
    CartItemRowComponent,
    CartSummaryPanelComponent,
    RouterLink,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {
  protected readonly cartStore = inject(CartStore);
}
