import type { Money } from '../../../core/models/commerce.model';

export interface CartSummary {
  totalQuantity: number;
  subtotal: Money | null;
}
