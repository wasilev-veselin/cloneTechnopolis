import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import type { CartItem, CartItemInput } from '../models/cart-item.model';
import type { CartSummary } from '../models/cart-summary.model';

const selectId = (item: CartItem) => item.sku;

export const CartStore = signalStore(
  { providedIn: 'root' },
  withEntities<CartItem>(),
  withComputed(({ entities }) => ({
    items: computed(() => entities()),
    totalQuantity: computed(() => entities().reduce((sum, item) => sum + item.quantity, 0)),
    subtotal: computed(() => {
      const cartItems = entities();
      const firstItem = cartItems[0];

      if (!firstItem) {
        return null;
      }

      return {
        amount: cartItems.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0),
        currencyCode: firstItem.unitPrice.currencyCode,
      };
    }),
  })),
  withComputed(({ totalQuantity, subtotal }) => ({
    summary: computed(
      (): CartSummary => ({
        totalQuantity: totalQuantity(),
        subtotal: subtotal(),
      }),
    ),
  })),
  withMethods((store) => ({
 
    addItem(item: CartItemInput): void {
      const cartItem: CartItem = {
        quantity: 1,
        ...item,
      };

      if (cartItem.quantity <= 0) {
        return;
      }

      const existing = store.entityMap()[cartItem.sku];
      if (existing) {
        patchState(
          store,
          updateEntity(
            { id: cartItem.sku, changes: { quantity: existing.quantity + cartItem.quantity } },
            { selectId },
          ),
        );
        return;
      }
      patchState(store, addEntity(cartItem, { selectId }));
    },
  
    updateQuantity(sku: string, quantity: number): void {
      if (quantity <= 0) {
        patchState(store, removeEntity(sku));
        return;
      }
      patchState(store, updateEntity({ id: sku, changes: { quantity } }, { selectId }));
    },
  
    removeItem(sku: string): void {
      patchState(store, removeEntity(sku));
    },
 
    clear(): void {
      patchState(store, removeAllEntities());
    },
  })),
);
