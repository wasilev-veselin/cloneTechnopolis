import { computed, Injectable, signal } from '@angular/core';
import type { CartItem } from '../models/cart-item.model';
import type { CartSummary } from '../models/cart-summary.model';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  readonly items = signal<CartItem[]>([]);

  readonly totalQuantity = computed(() =>
    this.items().reduce(
      (totalQuantity, item) => totalQuantity + item.quantity,
      0,
    ),
  );

  readonly subtotal = computed(() => {
    const cartItems = this.items();

    const amount = cartItems.reduce(
      (subtotalAmount, item) =>
        subtotalAmount + item.unitPrice.amount * item.quantity,
      0,
    );

    return {
      amount,
      currencyCode: cartItems[0]?.unitPrice.currencyCode ?? 'BGN',
    };
  });

  readonly summary = computed<CartSummary>(() => ({
    totalQuantity: this.totalQuantity(),
    subtotal: this.subtotal(),
  }));

  addItem(item: CartItem): void {
    const currentItems = this.items();
    const existingItem = currentItems.find(
      (cartItem) => cartItem.sku === item.sku,
    );

    if (existingItem) {
      this.items.set(
        currentItems.map((cartItem) =>
          cartItem.sku === item.sku
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem,
        ),
      );

      return;
    }

    this.items.set([...currentItems, item]);
  }

  updateQuantity(sku: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(sku);
      return;
    }

    this.items.set(
      this.items().map((cartItem) =>
        cartItem.sku === sku
          ? {
              ...cartItem,
              quantity,
            }
          : cartItem,
      ),
    );
  }

  removeItem(sku: string): void {
    this.items.set(this.items().filter((cartItem) => cartItem.sku !== sku));
  }

  clear(): void {
    this.items.set([]);
  }
}
