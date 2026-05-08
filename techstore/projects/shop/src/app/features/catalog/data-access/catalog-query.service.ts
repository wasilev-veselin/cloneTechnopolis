import { Injectable } from '@angular/core';
import type { ParamMap } from '@angular/router';
import type { CatalogQuery, CatalogSort } from '../models/catalog-query.model';

const defaultPage = 1;
const defaultPageSize = 24;
const defaultSort: CatalogSort = 'relevance';

@Injectable({
  providedIn: 'root',
})
export class CatalogQueryService {
  createFromParams(
    marketCode: string,
    categorySlug: string | null,
    queryParamMap: ParamMap,
  ): CatalogQuery {
    return {
      marketCode,
      categorySlug,
      searchTerm: queryParamMap.get('q'),
      selectedBrands: this.getListParam(queryParamMap, 'brand'),
      sort: this.getSort(queryParamMap),
      page: this.getNumberParam(queryParamMap, 'page', defaultPage),
      pageSize: this.getNumberParam(queryParamMap, 'pageSize', defaultPageSize),
    };
  }

  private getListParam(queryParamMap: ParamMap, key: string): string[] {
    const value = queryParamMap.get(key);

    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private getSort(queryParamMap: ParamMap): CatalogSort {
    const value = queryParamMap.get('sort');

    if (
      value === 'price-asc' ||
      value === 'price-desc' ||
      value === 'name-asc' ||
      value === 'name-desc'
    ) {
      return value;
    }

    return defaultSort;
  }

  private getNumberParam(
    queryParamMap: ParamMap,
    key: string,
    fallbackValue: number,
  ): number {
    const value = Number(queryParamMap.get(key));

    return Number.isFinite(value) && value > 0 ? value : fallbackValue;
  }
}
