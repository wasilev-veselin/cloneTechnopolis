import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import type { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/http/api-base-url.token';
import type { ProductImage } from '../../../core/models/commerce.model';
import type { CatalogQuery } from '../models/catalog-query.model';
import type { ProductSummary } from '../models/product-summary.model';

export interface CatalogResponse {
  products: ProductSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  sort?: CatalogQuery['sort'];
  facets?: CatalogFacet[];
  breadcrumbs?: CatalogBreadcrumb[];
  category?: CategorySummary;
}

interface ProductsApiResponse {
  items: ProductApiItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  facets?: CatalogFacet[];
  breadcrumbs?: CatalogBreadcrumb[];
  category?: CategorySummary;
}

export interface CatalogCategoryNode {
  code: string;
  name: string;
  children: CatalogCategoryNode[];
}

type ProductApiItem = Omit<ProductSummary, 'image'> & {
  images?: ProductImage[];
};

export interface CatalogFacet {
  code: string;
  label: string;
  type: 'multiSelect' | 'range' | 'singleSelect';
  values: CatalogFacetValue[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface CatalogFacetValue {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface CatalogBreadcrumb {
  label: string;
  slug?: string;
}

export interface CategorySummary {
  id: string;
  slug: string;
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const PLACEHOLDER_IMAGE_URL =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 3%22%3E%3Crect width=%224%22 height=%223%22 fill=%22%23f3f4f6%22/%3E%3C/svg%3E';

@Injectable({
  providedIn: 'root',
})
export class CatalogApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getCategories(): Observable<CatalogCategoryNode[]> {
    return this.httpClient.get<CatalogCategoryNode[]>(`${this.apiBaseUrl}/categories`);
  }

  getProducts(query: CatalogQuery): Observable<CatalogResponse> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);

    if (query.categoryCode) {
      params = params.set('categoryCode', query.categoryCode);
    }

    if (query.sort) {
      params = params.set('sort', query.sort);
    }

    if (query.selectedBrands.length > 0) {
      params = params.set('brand', query.selectedBrands.join(','));
    }

    for (const filter of query.specFilters) {
      if (filter.type === 'range') {
        if (filter.min !== undefined) params = params.set(`spec[${filter.code}][min]`, filter.min);
        if (filter.max !== undefined) params = params.set(`spec[${filter.code}][max]`, filter.max);
      } else if (filter.type === 'in' && filter.values?.length) {
        params = params.set(`spec[${filter.code}]`, filter.values.join(','));
      } else if (filter.type === 'eq' && filter.value !== undefined) {
        params = params.set(`spec[${filter.code}]`, String(filter.value));
      }
    }

    return this.httpClient.get<ProductsApiResponse>(`${this.apiBaseUrl}/products`, { params }).pipe(
      map((response) => ({
        products: response.items.map((item) => this.toProductSummary(item, query)),
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        sort: query.sort,
        facets: response.facets,
        breadcrumbs: response.breadcrumbs,
        category: response.category,
      })),
    );
  }

  private toProductSummary({ images, ...product }: ProductApiItem, query: CatalogQuery): ProductSummary {
    return {
      ...product,
      marketCode: product.marketCode ?? query.marketCode,
      locale: product.locale ?? query.locale,
      image: this.getPrimaryImage(images, product.title),
    };
  }

  private getPrimaryImage(images: ProductImage[] | undefined, title: string): ProductImage {
    return (
      images?.find((image) => image.role === 'primary') ??
      images?.[0] ?? {
        url: PLACEHOLDER_IMAGE_URL,
        altText: title,
        role: 'primary',
      }
    );
  }
}
