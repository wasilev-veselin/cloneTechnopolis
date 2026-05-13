import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorHandler, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import type { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error.handler';
import { API_BASE_URL } from './core/http/api-base-url.token';
import { httpErrorInterceptor } from './core/http/http-error.interceptor';
import { LoggerService } from './core/logging/logger.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withNavigationErrorHandler((error) => {
        const logger = inject(LoggerService);

        logger.error('Router navigation failed', error);
      }),
    ),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideClientHydration(withEventReplay()),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    { provide: API_BASE_URL, useValue: '/api' },
  ],
};
