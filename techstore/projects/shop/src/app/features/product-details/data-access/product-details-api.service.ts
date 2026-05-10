import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { ProductDetailsModel } from '../models/product-details.model';

export class ProductNotFoundError extends Error {
  constructor(idOrSlug: string) {
    super(`Product "${idOrSlug}" was not found.`);
    this.name = 'ProductNotFoundError';
  }
}

@Injectable({ providedIn: 'root' })
export class ProductDetailsApiService {
  private readonly http = inject(HttpClient);

  getProduct(idOrSlug: string): Observable<ProductDetailsModel> {
    return this.http.get<ProductDetailsModel>(`/api/products/${idOrSlug}`).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return throwError(() => new ProductNotFoundError(idOrSlug));
        }
        return throwError(() => error);
      }),
    );
  }
}
