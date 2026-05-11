import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import type { Observable } from 'rxjs';

export type ApplicationErrorCode =
  | 'FORBIDDEN'
  | 'HTTP_ERROR'
  | 'NETWORK_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'UNKNOWN_ERROR';

export interface ApplicationError {
  readonly code: ApplicationErrorCode;
  readonly message: string;
  readonly technicalMessage?: string;
  readonly status?: number;
}

const DEFAULT_TECHNICAL_MESSAGE = 'Възникна техническа грешка. Опитайте отново.';

export const isApplicationError = (error: unknown): error is ApplicationError =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  'message' in error &&
  typeof (error as ApplicationError).code === 'string' &&
  typeof (error as ApplicationError).message === 'string';

export const mapToApplicationError = (error: unknown): ApplicationError => {
  if (isApplicationError(error)) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    return mapHttpError(error);
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Възникна неочаквана грешка.',
      technicalMessage: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Възникна неочаквана грешка.',
  };
};

export const rethrowApplicationError = (error: unknown): Observable<never> =>
  throwError(() => mapToApplicationError(error));

const mapHttpError = (error: HttpErrorResponse): ApplicationError => {
  const backendMessage = getBackendMessage(error.error);
  const technicalMessage = error.message;

  if (error.status === 0) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Няма връзка със сървъра. Проверете интернет връзката си.',
      technicalMessage,
      status: error.status,
    };
  }

  if (error.status === 401) {
    return {
      code: 'UNAUTHORIZED',
      message: backendMessage ?? 'Необходимо е да влезете отново в профила си.',
      technicalMessage,
      status: error.status,
    };
  }

  if (error.status === 403) {
    return {
      code: 'FORBIDDEN',
      message: backendMessage ?? 'Нямате права за тази операция.',
      technicalMessage,
      status: error.status,
    };
  }

  if (error.status === 404) {
    return {
      code: 'NOT_FOUND',
      message: backendMessage ?? 'Търсеният ресурс не е намерен.',
      technicalMessage,
      status: error.status,
    };
  }

  if (error.status >= 500) {
    return {
      code: 'SERVER_ERROR',
      message: backendMessage ?? DEFAULT_TECHNICAL_MESSAGE,
      technicalMessage,
      status: error.status,
    };
  }

  return {
    code: 'HTTP_ERROR',
    message: backendMessage ?? DEFAULT_TECHNICAL_MESSAGE,
    technicalMessage,
    status: error.status,
  };
};

const getBackendMessage = (body: unknown): string | undefined => {
  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof body.message === 'string' &&
    body.message.trim().length > 0
  ) {
    return body.message;
  }

  return undefined;
};
