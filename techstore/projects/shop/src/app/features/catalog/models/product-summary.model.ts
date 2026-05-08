export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: ProductSummaryPrice;
  imageUrl: string;
  stockStatus: ProductStockStatus;
}

export interface ProductSummaryPrice {
  amount: number;
  currencyCode: string;
}

export type ProductStockStatus = 'inStock' | 'limited' | 'outOfStock';
