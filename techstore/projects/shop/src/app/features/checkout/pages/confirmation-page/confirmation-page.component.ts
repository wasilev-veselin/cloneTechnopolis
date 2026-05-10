import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@techstore/design-system';
import { CartStore } from '../../../cart/store/cart.store';
import { CheckoutStore } from '../../store/checkout.store';

@Component({
  selector: 'app-confirmation-page',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPageComponent implements OnInit, OnDestroy {
  private readonly cartStore = inject(CartStore);
  private readonly checkoutStore = inject(CheckoutStore);

  protected readonly confirmation = this.checkoutStore.orderConfirmation;

  ngOnInit(): void {
    this.cartStore.clear();
  }

  ngOnDestroy(): void {
    this.checkoutStore.reset();
  }
}
