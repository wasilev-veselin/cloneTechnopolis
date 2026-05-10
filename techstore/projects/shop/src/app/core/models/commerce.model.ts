export const DEFAULT_CURRENCY_CODE = 'EUR';

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductPrice {
  current: Money;
  original?: Money;
  discountPercent?: number;
  includesTax: boolean;
  taxRate?: number;
  validUntil?: string;
}

export interface ProductAvailability {
  status: ProductAvailabilityStatus;
  quantity?: number;
  estimatedDeliveryDate?: string;
  storesAvailableCount?: number;
}

export type ProductAvailabilityStatus =
  | 'inStock'
  | 'limited'
  | 'outOfStock'
  | 'preorder'
  | 'onlineOnly';

export interface ProductImage {
  url: string;
  altText: string;
  role?: ProductImageRole;
}

export type ProductImageRole = 'primary' | 'gallery' | 'thumbnail';

export interface ProductBadge {
  code: string;
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export interface SeoMetadata {
  title?: string;
  description?: string;
}
