import { HttpErrorResponse } from '@angular/common/http';
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { mapToApplicationError } from '../errors/application-error';
import { LoggerService } from '../logging/logger.service';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const logger = inject(LoggerService);

  return next(request).pipe(
    catchError((error: unknown) => {
      const applicationError = mapToApplicationError(error);

      if (error instanceof HttpErrorResponse) {
        logger.error('HTTP request failed', error, {
          method: request.method,
          status: error.status,
          url: request.urlWithParams,
          errorCode: applicationError.code,
        });
      }

      return throwError(() => applicationError);
    }),
  );
};
