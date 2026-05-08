export interface CartSummary {
  totalQuantity: number;
  subtotal: {
    amount: number;
    currencyCode: string;
  };
}
