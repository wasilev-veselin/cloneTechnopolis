import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { CatalogQuery } from '../models/catalog-query.model';
import type { ProductSummary } from '../models/product-summary.model';

export interface CatalogResponse {
  products: ProductSummary[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogApiService {
  private readonly httpClient = inject(HttpClient);

  getProducts(query: CatalogQuery): Observable<CatalogResponse> {
    let params = new HttpParams()
      .set('marketCode', query.marketCode)
      .set('page', query.page)
      .set('pageSize', query.pageSize)
      .set('sort', query.sort);

    if (query.categorySlug) {
      params = params.set('categorySlug', query.categorySlug);
    }

    if (query.searchTerm) {
      params = params.set('q', query.searchTerm);
    }

    if (query.selectedBrands.length > 0) {
      params = params.set('brand', query.selectedBrands.join(','));
    }

    return this.httpClient.get<CatalogResponse>('/api/catalog/products', {
      params,
    });
  }
}
