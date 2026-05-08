import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ProductDetails } from '../models/product-details.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsApiService {
  private readonly httpClient = inject(HttpClient);

  getProductBySlug(
    marketCode: string,
    productSlug: string,
  ): Observable<ProductDetails> {
    return this.httpClient.get<ProductDetails>(`/api/products/${productSlug}`, {
      params: {
        marketCode,
      },
    });
  }
}
