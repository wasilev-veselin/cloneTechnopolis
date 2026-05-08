export interface CartItem {
  productId: string;
  sku: string;
  title: string;
  brand: string;
  unitPrice: CartItemPrice;
  quantity: number;
  imageUrl?: string;
}

export interface CartItemPrice {
  amount: number;
  currencyCode: string;
}
