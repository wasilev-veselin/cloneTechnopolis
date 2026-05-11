import { Injectable } from '@angular/core';

export type LogContext = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(message, { error, ...context });
  }

  warn(message: string, error?: unknown, context?: LogContext): void {
    console.warn(message, { error, ...context });
  }

  info(message: string, context?: LogContext): void {
    console.info(message, context);
  }
}
