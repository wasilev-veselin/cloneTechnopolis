import type { CategorySpecs } from '../../../core/models/category-specs.model';
import type {
  ProductAvailability,
  ProductBadge,
  ProductImage,
  ProductPrice,
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
  categorySpecs?: CategorySpecs;
  variants: ProductVariant[];
  price: ProductPrice;
  availability: ProductAvailability;
}

interface ProductProperty {
  code: string;
  label: string;
  value: string;
  unit?: string;
}

export interface ProductSpec extends ProductProperty {
  groupCode?: string;
  groupLabel?: string;
  comparable?: boolean;
  filterable?: boolean;
}

export type ProductAttribute = ProductProperty;

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
