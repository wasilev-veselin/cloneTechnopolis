import type {
  ProductAvailability,
  ProductBadge,
  ProductImage,
  ProductPrice,
  SeoMetadata,
} from '../../../core/models/commerce.model';

export interface ProductSummary {
  id: string;
  masterProductId: string;
  marketCode: string;
  locale: string;
  slug: string;
  title: string;
  brand: string;
  categoryIds: string[];
  price: ProductPrice;
  image: ProductImage;
  availability: ProductAvailability;
  badges?: ProductBadge[];
  seo?: SeoMetadata;
}
