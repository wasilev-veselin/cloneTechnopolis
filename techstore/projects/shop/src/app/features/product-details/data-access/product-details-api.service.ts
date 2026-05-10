import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ProductDetailsModel } from '../models/product-details.model';

@Injectable({ providedIn: 'root' })
export class ProductDetailsApiService {
  private readonly http = inject(HttpClient);

  getProduct(idOrSlug: string): Observable<ProductDetailsModel> {
    return this.http.get<ProductDetailsModel>(`/api/products/${idOrSlug}`);
  }
}
