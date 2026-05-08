import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, PriceTagComponent } from '@techstore/design-system';
import type { CartSummary } from '../../models/cart-summary.model';

@Component({
  selector: 'app-cart-summary-panel',
  imports: [ButtonComponent, PriceTagComponent, RouterLink],
  templateUrl: './cart-summary-panel.component.html',
  styleUrl: './cart-summary-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryPanelComponent {
  readonly summary = input.required<CartSummary>();
}
