import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import type { CartItem } from '../models/cart-item.model';
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
      return {
        amount: cartItems.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0),
        currencyCode: cartItems[0]?.unitPrice.currencyCode ?? 'BGN',
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
 
    addItem(item: CartItem): void {
      const existing = store.entityMap()[item.sku];
      if (existing) {
        patchState(
          store,
          updateEntity(
            { id: item.sku, changes: { quantity: existing.quantity + item.quantity } },
            { selectId },
          ),
        );
        return;
      }
      patchState(store, addEntity(item, { selectId }));
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
