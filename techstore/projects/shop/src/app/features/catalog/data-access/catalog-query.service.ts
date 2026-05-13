import { Injectable } from '@angular/core';
import type { ParamMap } from '@angular/router';
import { CATALOG_SORT_VALUES } from '../models/catalog-query.model';
import type { CatalogQuery, CatalogSort, SpecFilter } from '../models/catalog-query.model';

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
  queryParamMap?: ParamMap;
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
    queryParamMap,
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
      specFilters: this.createSpecFilters(queryParamMap),
      sort: this.validateSort(sort),
      page: Number.isFinite(page) && page > 0 ? page : DEFAULT_PAGE,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE,
    };
  }

  private createSpecFilters(queryParamMap: ParamMap | undefined): SpecFilter[] {
    if (!queryParamMap) {
      return [];
    }

    const filters = new Map<string, SpecFilter>();
    const specParamPattern = /^spec\[([^\]]+)\](?:\[(min|max)\])?$/;

    for (const key of queryParamMap.keys) {
      const match = specParamPattern.exec(key);

      if (!match) {
        continue;
      }

      const [, code, rangeBound] = match;
      const value = queryParamMap.get(key)?.trim();

      if (!code || !value) {
        continue;
      }

      if (rangeBound === 'min' || rangeBound === 'max') {
        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
          continue;
        }

        const current = filters.get(code);
        const rangeFilter: SpecFilter =
          current?.type === 'range' ? current : { code, type: 'range' };

        rangeFilter[rangeBound] = numericValue;
        filters.set(code, rangeFilter);
        continue;
      }

      const values = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (values.length === 1) {
        filters.set(code, { code, type: 'eq', value: values[0] });
      } else if (values.length > 1) {
        filters.set(code, { code, type: 'in', values });
      }
    }

    return [...filters.values()];
  }

  private validateSort(value: string | null | undefined): CatalogSort | undefined {
    return (CATALOG_SORT_VALUES as readonly string[]).includes(value ?? '')
      ? (value as CatalogSort)
      : undefined;
  }
}
