export interface ProductDetails {
  id: string;
  slug: string;
  title: string;
  brand: string;
  description: string;
  price: ProductDetailsPrice;
  images: ProductImage[];
  specs: ProductSpec[];
  variants: ProductVariant[];
  stockStatus: ProductStockStatus;
}

export interface ProductDetailsPrice {
  amount: number;
  currencyCode: string;
}

export interface ProductImage {
  url: string;
  altText: string;
}

export interface ProductSpec {
  label: string;
  value: string;
  group?: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  available: boolean;
}

export type ProductStockStatus = 'inStock' | 'limited' | 'outOfStock';
