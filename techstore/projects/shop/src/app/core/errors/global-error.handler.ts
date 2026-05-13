import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { mapToApplicationError } from './application-error';
import { LoggerService } from '../logging/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);

  handleError(error: unknown): void {
    if (this.isHmrEvalError(error)) {
      return;
    }

    this.logger.error('Unhandled application error', error, {
      applicationError: mapToApplicationError(error),
      url: this.router.url,
    });
  }

  // provideBrowserGlobalErrorListeners() catches HMR module re-evaluation errors
  // (stack contains @ng/component?c=) which are dev-only artifacts, not app bugs.
  private isHmrEvalError(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.stack ?? '').includes('@ng/component?c=')
    );
  }
}
