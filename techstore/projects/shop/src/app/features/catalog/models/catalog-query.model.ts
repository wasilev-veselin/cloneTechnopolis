export interface CatalogQuery {
  marketCode: string;
  categorySlug: string | null;
  searchTerm: string | null;
  selectedBrands: string[];
  sort: CatalogSort;
  page: number;
  pageSize: number;
}

export type CatalogSort =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';
