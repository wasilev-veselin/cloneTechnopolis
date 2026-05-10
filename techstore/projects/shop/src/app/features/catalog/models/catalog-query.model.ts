export interface CatalogQuery {
  marketCode: string;
  locale: string;
  currencyCode?: string;
  categoryCode: string | null;
  searchTerm: string | null;
  selectedBrands: string[];
  specFilters: SpecFilter[];
  sort?: CatalogSort;
  page: number;
  pageSize: number;
}

export type CatalogSort = 'price-asc' | 'price-desc' | 'rating-desc';

export type SpecFilterType = 'eq' | 'range' | 'in';

export interface SpecFilter {
  code: string;
  type: SpecFilterType;
  value?: string | number;
  min?: number;
  max?: number;
  values?: string[];
}
