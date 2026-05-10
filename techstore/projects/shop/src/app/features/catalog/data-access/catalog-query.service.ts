import { Injectable } from '@angular/core';
import type { CatalogQuery, CatalogSort } from '../models/catalog-query.model';

const ALL_CATEGORIES_SLUG = 'all';
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 24;

const LOCALE_BY_MARKET: Record<string, string> = {
  bg: 'bg-BG',
  en: 'en-US',
};

export interface CatalogQueryInputs {
  marketCode: string;
  categorySlug: string | null | undefined;
  sort: string | null | undefined;
  brand: string | null | undefined;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogQueryService {
  createFromInputs({
    marketCode,
    categorySlug,
    sort,
    brand,
    page,
    pageSize,
  }: CatalogQueryInputs): CatalogQuery {
    return {
      marketCode,
      locale: LOCALE_BY_MARKET[marketCode] ?? 'en-US',
      categoryCode: categorySlug === ALL_CATEGORIES_SLUG ? null : (categorySlug ?? null),
      searchTerm: null,
      selectedBrands: brand
        ? brand
            .split(',')
            .map((b) => b.trim())
            .filter(Boolean)
        : [],
      specFilters: [],
      sort: this.validateSort(sort),
      page: Number.isFinite(page) && page > 0 ? page : DEFAULT_PAGE,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE,
    };
  }

  private validateSort(value: string | null | undefined): CatalogSort | undefined {
    if (value === 'price-asc' || value === 'price-desc' || value === 'rating-desc') {
      return value;
    }

    return undefined;
  }
}
