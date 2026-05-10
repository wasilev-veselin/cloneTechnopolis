import type { Money } from '../../../core/models/commerce.model';

export interface CartItem {
  productId: string;
  sku: string;
  title: string;
  brand: string;
  unitPrice: Money;
  quantity: number;
  imageUrl?: string;
}

export type CartItemInput = Omit<CartItem, 'quantity'> & { quantity?: number };
