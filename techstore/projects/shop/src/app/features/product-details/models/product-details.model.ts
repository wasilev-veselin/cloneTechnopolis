import type {
  ProductAvailability,
  ProductBadge,
  ProductImage,
  ProductPrice,
  ProductStockStatus,
  SeoMetadata,
} from '../../../core/models/commerce.model';

export interface ProductDetailsModel {
  id: string;
  masterProductId: string;
  marketCode: string;
  locale: string;
  slug: string;
  title: string;
  brand: string;
  manufacturerCode?: string;
  categoryIds: string[];
  description: string;
  seo?: SeoMetadata;
  badges?: ProductBadge[];
  images: ProductImage[];
  specs: ProductSpec[];
  variants: ProductVariant[];
  price: ProductPrice;
  availability: ProductAvailability;
  stockStatus: ProductStockStatus;
}

export interface ProductSpec {
  code: string;
  label: string;
  value: string;
  unit?: string;
  groupCode?: string;
  groupLabel?: string;
  comparable?: boolean;
  filterable?: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  attributes: ProductAttribute[];
  price?: ProductPrice;
  availability: ProductAvailability;
  images?: ProductImage[];
  isDefault: boolean;
}

export interface ProductAttribute {
  code: string;
  label: string;
  value: string;
  unit?: string;
}
